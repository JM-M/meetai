import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { meetingsInsertSchema } from "../../schemas";
import { MeetingGetOne } from "../../types";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

type MeetingInsertSchema = z.infer<typeof meetingsInsertSchema>;

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");

  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({
              id: initialValues.id,
            }),
          );
        }
        onSuccess?.(data.id);
      },
      onError: (error) => {
        // TODO: Redirect if forbidden
        toast.error(error.message);
      },
    }),
  );

  const createAgent = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );

        // TODO: Invalidate free tier usage
        onSuccess?.();
      },
      onError: (error) => {
        // TODO: Redirect if forbidden
        toast.error(error.message);
      },
    }),
  );

  const form = useForm<MeetingInsertSchema>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateMeeting.isPending;

  const onSubmit = (values: MeetingInsertSchema) => {
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: initialValues.id });
    } else {
      createAgent.mutate(values);
    }
  };

  return (
    <>
      <NewAgentDialog
        open={openNewAgentDialog}
        onOpenChange={setOpenNewAgentDialog}
      />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Math consultations" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GeneratedAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="size-6 border"
                          />
                          <span>{agent.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Select an agent"
                  />
                </FormControl>
                <FormDescription>
                  Can{"'"}t find what you{"'"}re looking for?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    Create New Agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                onClick={onCancel}
                disabled={isPending}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
