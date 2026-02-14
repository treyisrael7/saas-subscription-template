"use client";

import { useEffect, useState } from "react";
import { useProfileContext } from "@/contexts/ProfileContext";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";
import { FormInput } from "@/components/ui/FormInput";
import { FormMessage } from "@/components/ui/FormMessage";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function SettingsPage() {
  const { profile, loading, mutate } = useProfileContext();
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile?.full_name]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/profile/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName }),
    });
    const data = await res.json();

    if (!res.ok) {
      setMessage({ type: "error", text: data.error ?? "Failed to update profile" });
    } else {
      setMessage({ type: "success", text: "Profile updated" });
      mutate({ full_name: fullName });
    }
    setSaving(false);
  };

  return (
    <DashboardPageShell
      title="Settings"
      description="Update your account preferences."
    >
      <form onSubmit={handleSave} className="mt-8 card-glassy p-6 sm:p-8 space-y-6 max-w-md">
        {message && <FormMessage type={message.type} message={message.text} />}
        <FormInput
          id="fullName"
          name="fullName"
          label="Full name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
        />
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
          <p className="text-neutral-400">{profile?.email ?? "—"}</p>
          <p className="text-neutral-500 text-xs mt-1">Email is managed by your auth provider.</p>
        </div>
        <SubmitButton
          disabled={loading}
          loading={saving}
          loadingText="Saving..."
        >
          Save changes
        </SubmitButton>
      </form>
    </DashboardPageShell>
  );
}
