"use client";

import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div className="flex flex-1 flex-col gap-y-4 px-4 pb-4 md:px-8">
      <DataTable data={data.items} columns={columns} />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Schedule your first meeting."
        />
      )}
    </div>
  );
};

export const MeetingsViewLoading = () => (
  <LoadingState
    title="Loading Meetings"
    description="This may take a few seconds"
  />
);

export const MeetingsViewError = () => (
  <ErrorState
    title="Failed to load meetings"
    description="Something went wrong. Please try again later."
  />
);
