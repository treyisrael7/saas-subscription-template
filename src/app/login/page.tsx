import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
