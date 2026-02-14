import Link from "next/link";

interface AuthSuccessMessageProps {
  title: string;
  message: string;
  linkText?: string;
  linkHref?: string;
}

export function AuthSuccessMessage({
  title,
  message,
  linkText = "Back to sign in",
  linkHref = "/login",
}: AuthSuccessMessageProps) {
  return (
    <div className="max-w-md text-center space-y-6">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <p className="text-neutral-400">{message}</p>
      <Link href={linkHref} className="inline-block text-white hover:underline">
        {linkText}
      </Link>
    </div>
  );
}
