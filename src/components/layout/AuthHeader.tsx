import { getAuth } from "@/lib/auth";
import { Header } from "./Header";

export async function AuthHeader() {
  const { user, profile } = await getAuth();
  return <Header user={user} profile={profile} />;
}
