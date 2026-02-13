"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { profile, loading } = useProfile();
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

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated" });
    }
    setSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <p className="text-neutral-400 mt-2">Update your account preferences.</p>

      <form onSubmit={handleSave} className="mt-8 space-y-6 max-w-md">
        {message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/20 text-green-200"
                : "bg-red-500/10 border border-red-500/20 text-red-200"
            }`}
          >
            {message.text}
          </div>
        )}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-neutral-300 mb-1">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:border-neutral-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
          <p className="text-neutral-400">{profile?.email ?? "—"}</p>
          <p className="text-neutral-500 text-xs mt-1">Email is managed by your auth provider.</p>
        </div>
        <button
          type="submit"
          disabled={saving || loading}
          className="px-4 py-2 rounded-full btn-primary disabled:opacity-50 text-sm font-medium"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
