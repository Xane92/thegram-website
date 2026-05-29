"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateStoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    body: "",
    category: "music",
    author: "TheGram Editorial",
    cover_image_url: "",
    published: false,
  });

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

    const { error: insertErr } = await supabase
      .from("stories")
      .insert([form]);

    if (insertErr) {
      setError(insertErr.message);
      setLoading(false);
    } else {
      router.push("/admin/stories");
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-serif font-bold text-warm mb-8">
        Create New Story
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
            placeholder="Story title"
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
            placeholder="Brief excerpt..."
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
            placeholder="Full story content..."
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
            {loading ? "Saving..." : "Save Story"}
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
