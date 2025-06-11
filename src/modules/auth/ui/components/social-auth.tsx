import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { FaGithub, FaGoogle } from "react-icons/fa";

type Props = {
  pending: boolean;
  setPending: (pending: boolean) => void;
  setError: (error: string | null) => void;
}

export const SocialAuth = ({
  pending, 
  setPending,
  setError, 
}:Props) => {
    const onSocial = (provider: "github" | "google") => {
      setError(null);
      setPending(true);
  
      authClient.signIn.social(
        {
          provider,
          callbackURL: "/",
        },
        {
          onSuccess: () => {
            setPending(false);
          },
          onError: ({ error }) => {
            setPending(false);
            setError(error.message);
          },
        },
      );
    };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={() => onSocial("google")}
      >
        <FaGoogle /> Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={pending}
        onClick={() => onSocial("github")}
      >
        <FaGithub /> Github
      </Button>
    </div>
  )
}