"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase, type StoryImage } from "@/lib/supabase";

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
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const [storyImages, setStoryImages] = useState<StoryImage[]>([]);
  const [uploadingStoryImage, setUploadingStoryImage] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<number | null>(null);

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

      const imgs = data.images ?? [];
      setStoryImages(
        (imgs as StoryImage[]).sort(
          (a: StoryImage, b: StoryImage) => a.order - b.order
        )
      );

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

  async function handleImageRemove() {
    if (!form.cover_image_url) return;
    const path = form.cover_image_url.split("/media/")[1];
    if (path) await supabase.storage.from("media").remove([path]);
    updateField("cover_image_url", "");
    setImagePreview(null);
  }

  async function handleStoryImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingStoryImage(true);
    setError("");
    const ext = file.name.split(".").pop();
    const path = `stories/${Date.now()}-img.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("media")
      .upload(path, file);

    if (uploadErr) {
      setError(uploadErr.message);
      setUploadingStoryImage(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(path);

    setStoryImages((prev) => [
      ...prev,
      { url: publicUrl, caption: "", order: prev.length },
    ]);
    setUploadingStoryImage(false);
    e.target.value = "";
  }

  function updateCaption(index: number, caption: string) {
    setStoryImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, caption } : img))
    );
  }

  function moveImage(index: number, direction: "up" | "down") {
    setStoryImages((prev) => {
      const next = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= next.length) return prev;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next.map((img, i) => ({ ...img, order: i }));
    });
  }

  async function handleStoryImageRemove(index: number) {
    const img = storyImages[index];
    const path = img.url.split("/media/")[1];
    if (path) await supabase.storage.from("media").remove([path]);
    setStoryImages((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, order: i }))
    );
    setRemoveTarget(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: updateErr } = await supabase
      .from("stories")
      .update({ ...form, images: storyImages })
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
          {imagePreview || form.cover_image_url ? (
            <div className="relative inline-block mt-1">
              <img
                src={imagePreview || form.cover_image_url}
                alt="Preview"
                className="max-h-48 object-cover border border-white/10"
              />
              <button
                type="button"
                onClick={() => setShowRemoveModal(true)}
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

        {/* Story Images */}
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Story Images
          </label>
          <p className="text-xs text-warm-dim/30 mb-4">
            Add images that appear within the story body. Each can have a
            caption.
          </p>

          {storyImages.length > 0 && (
            <div className="space-y-4 mb-4">
              {storyImages.map((img, index) => (
                <div
                  key={img.url}
                  className="bg-charcoal border border-white/10 p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={img.url}
                      alt={img.caption || `Image ${index + 1}`}
                      className="w-24 h-24 object-cover shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => updateCaption(index, e.target.value)}
                        placeholder="Image caption (e.g. Lagos skyline — Photo by John Doe)"
                        className="w-full bg-navy border border-white/10 px-3 py-2 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50"
                      />
                      <div className="flex gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => moveImage(index, "up")}
                          disabled={index === 0}
                          className="px-2 py-1 text-xs text-warm-dim/50 border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          &uarr; Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, "down")}
                          disabled={index === storyImages.length - 1}
                          className="px-2 py-1 text-xs text-warm-dim/50 border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          &darr; Down
                        </button>
                        <button
                          type="button"
                          onClick={() => setRemoveTarget(index)}
                          className="px-2 py-1 text-xs text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors ml-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleStoryImageUpload}
            className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm-dim/50 file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:bg-crimson/20 file:text-crimson file:cursor-pointer"
          />
          {uploadingStoryImage && (
            <p className="mt-2 text-xs text-warm-dim/40">
              Uploading image...
            </p>
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

      {/* Cover image remove modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-charcoal border border-white/10 p-6 max-w-sm w-full mx-4">
            <p className="text-sm text-warm mb-6">
              Are you sure you want to remove this image?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-5 py-2 text-xs tracking-[0.1em] uppercase text-warm-dim/50 border border-white/10 hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleImageRemove();
                  setShowRemoveModal(false);
                }}
                className="px-5 py-2 text-xs tracking-[0.1em] uppercase bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story image remove modal */}
      {removeTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-charcoal border border-white/10 p-6 max-w-sm w-full mx-4">
            <p className="text-sm text-warm mb-6">
              Are you sure you want to remove this image?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRemoveTarget(null)}
                className="px-5 py-2 text-xs tracking-[0.1em] uppercase text-warm-dim/50 border border-white/10 hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStoryImageRemove(removeTarget)}
                className="px-5 py-2 text-xs tracking-[0.1em] uppercase bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
