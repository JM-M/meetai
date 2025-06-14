"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const AgentsView = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export const AgentsViewLoading = () => (
  <LoadingState
    title="Loading Agents"
    description="This may taka a few seconds"
  />
);

export const AgentsViewError = () => (
  <ErrorState
    title="Failed to load agents"
    description="Something went wrong. Please try again later."
  />
);
