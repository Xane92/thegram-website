"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    cover_image_url: "",
    ticket_link: "",
    published: false,
  });

  useEffect(() => {
    async function fetchEvent() {
      const { data, error: fetchErr } = await supabase
        .from("events")
        .select("*")
        .eq("id", params.id)
        .single();

      if (fetchErr || !data) {
        setError("Event not found");
        setFetching(false);
        return;
      }

      const dateVal = data.date
        ? new Date(data.date).toISOString().slice(0, 16)
        : "";

      setForm({
        name: data.name ?? "",
        date: dateVal,
        location: data.location ?? "",
        description: data.description ?? "",
        cover_image_url: data.cover_image_url ?? "",
        ticket_link: data.ticket_link ?? "",
        published: data.published ?? false,
      });
      if (data.cover_image_url) setImagePreview(data.cover_image_url);
      setFetching(false);
    }
    fetchEvent();
  }, [params.id]);

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    const ext = file.name.split(".").pop();
    const path = `events/${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("media")
      .upload(path, file);

    if (uploadErr) {
      setError(uploadErr.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(path);
    updateField("cover_image_url", publicUrl);
    setImagePreview(URL.createObjectURL(file));
    setUploading(false);
  }

  async function handleImageRemove() {
    if (!form.cover_image_url) return;
    const path = form.cover_image_url.split("/media/")[1];
    if (path) await supabase.storage.from("media").remove([path]);
    updateField("cover_image_url", "");
    setImagePreview(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: updateErr } = await supabase
      .from("events")
      .update(form)
      .eq("id", params.id);

    if (updateErr) {
      setError(updateErr.message);
      setLoading(false);
    } else {
      router.push("/admin/events");
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-crimson/30 border-t-crimson rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-serif font-bold text-warm mb-8">
        Edit Event
      </h1>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Event Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Date
          </label>
          <input
            type="datetime-local"
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
            required
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50 [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Location
          </label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
            required
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={5}
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Cover Image
          </label>
          {imagePreview || form.cover_image_url ? (
            <div className="relative inline-block mt-1">
              <img
                src={imagePreview || form.cover_image_url}
                alt="Preview"
                className="max-h-48 object-cover border border-white/10"
              />
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-[0.6rem] tracking-wider uppercase px-2.5 py-1 transition-colors"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm-dim/50 file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:bg-crimson/20 file:text-crimson file:cursor-pointer"
              />
              {uploading && (
                <p className="mt-2 text-xs text-warm-dim/40">Uploading...</p>
              )}
            </>
          )}
        </div>

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Ticket Link
          </label>
          <input
            type="url"
            value={form.ticket_link}
            onChange={(e) => updateField("ticket_link", e.target.value)}
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => updateField("published", !form.published)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              form.published ? "bg-crimson" : "bg-white/10"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                form.published ? "translate-x-5" : ""
              }`}
            />
          </button>
          <span className="text-sm text-warm-dim/60">
            {form.published ? "Published" : "Draft"}
          </span>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-crimson px-8 py-3 text-sm font-semibold tracking-[0.15em] uppercase text-warm hover:bg-darkred transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Event"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            className="px-8 py-3 text-sm tracking-[0.15em] uppercase text-warm-dim/50 border border-white/10 hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
