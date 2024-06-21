import { useAuth } from "@/context/useAuth";
import { useRouter } from "next/router";

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();

  if (currentUser) {
    router.push("/dashboard/main");
  }
  {
    router.push("/auth/login");
  }

  return <div />;
}
