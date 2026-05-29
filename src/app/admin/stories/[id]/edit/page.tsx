"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  "music",
  "culture",
  "film",
  "fashion",
  "events",
  "finance",
  "policies",
  "startups",
  "lifestyle",
];

export default function EditStoryPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    body: "",
    category: "music",
    author: "",
    cover_image_url: "",
    published: false,
  });

  useEffect(() => {
    async function fetchStory() {
      const { data, error: fetchErr } = await supabase
        .from("stories")
        .select("*")
        .eq("id", params.id)
        .single();

      if (fetchErr || !data) {
        setError("Story not found");
        setFetching(false);
        return;
      }

      setForm({
        title: data.title ?? "",
        excerpt: data.excerpt ?? "",
        body: data.body ?? "",
        category: data.category ?? "music",
        author: data.author ?? "",
        cover_image_url: data.cover_image_url ?? "",
        published: data.published ?? false,
      });
      if (data.cover_image_url) setImagePreview(data.cover_image_url);
      setFetching(false);
    }
    fetchStory();
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
    const path = `stories/${Date.now()}.${ext}`;

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: updateErr } = await supabase
      .from("stories")
      .update(form)
      .eq("id", params.id);

    if (updateErr) {
      setError(updateErr.message);
      setLoading(false);
    } else {
      router.push("/admin/stories");
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
        Edit Story
      </h1>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Excerpt
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
            rows={3}
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Body
          </label>
          <textarea
            value={form.body}
            onChange={(e) => updateField("body", e.target.value)}
            rows={12}
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50 resize-y"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-charcoal">
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Author
          </label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => updateField("author", e.target.value)}
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50"
          />
        </div>

        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm-dim/50 file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:bg-crimson/20 file:text-crimson file:cursor-pointer"
          />
          {uploading && (
            <p className="mt-2 text-xs text-warm-dim/40">Uploading...</p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-3 max-h-48 object-cover border border-white/10"
            />
          )}
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
            {loading ? "Updating..." : "Update Story"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/stories")}
            className="px-8 py-3 text-sm tracking-[0.15em] uppercase text-warm-dim/50 border border-white/10 hover:border-white/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
