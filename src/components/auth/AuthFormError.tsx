import { FormMessage } from "@/components/ui/FormMessage";

export function AuthFormError({ message }: { message: string }) {
  return <FormMessage type="error" message={message} />;
}
