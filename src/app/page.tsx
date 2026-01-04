'use client'
import { useAuth, useLogout } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button"

export default function Home() {
  const { user } = useAuth();
  const logOut = useLogout()

  return (
    <div>
      <h1>Onde eu to</h1>
      <span className="text-zinc-50">{user?.name}</span>
      <Button onClick={() => logOut.mutate()}>
        logout
      </Button >
    </div>
  );
}
