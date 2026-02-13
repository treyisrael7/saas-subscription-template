import { redirect } from "next/navigation";

/** Redirect /pricing to home (pricing section is now on /) */
export default function PricingPage() {
  redirect("/#pricing");
}
