import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
