"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      Logged in as {session.user.name}
      <Button
        className="mt-3 flex w-full"
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => router.push("/sign-in"),
            },
          })
        }
      >
        Sign out
      </Button>
    </div>
  );
};
