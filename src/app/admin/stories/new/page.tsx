"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, type ContentBlock } from "@/lib/supabase";

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

function InsertMenu({
  onAdd,
}: {
  onAdd: (type: "text" | "image") => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center py-2">
      {open ? (
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => {
              onAdd("text");
              setOpen(false);
            }}
            className="px-3 py-1.5 text-xs tracking-[0.1em] uppercase bg-white/5 text-warm-dim/60 hover:bg-white/10 hover:text-warm transition-colors"
          >
            + Text
          </button>
          <button
            type="button"
            onClick={() => {
              onAdd("image");
              setOpen(false);
            }}
            className="px-3 py-1.5 text-xs tracking-[0.1em] uppercase bg-white/5 text-warm-dim/60 hover:bg-white/10 hover:text-warm transition-colors"
          >
            + Image
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-2 py-1.5 text-xs text-warm-dim/30 hover:text-warm-dim/60 transition-colors"
          >
            &times;
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-8 h-8 flex items-center justify-center text-warm-dim/20 hover:text-crimson/60 border border-transparent hover:border-white/10 rounded-full transition-all"
        >
          +
        </button>
      )}
    </div>
  );
}

export default function CreateStoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [uploadingBlock, setUploadingBlock] = useState<number | null>(null);
  const [removeTarget, setRemoveTarget] = useState<number | null>(null);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    category: "music",
    author: "THEGRAM Editorial",
    cover_image_url: "",
    published: false,
  });

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

  async function handleCoverRemove() {
    if (!form.cover_image_url) return;
    const path = form.cover_image_url.split("/media/")[1];
    if (path) await supabase.storage.from("media").remove([path]);
    updateField("cover_image_url", "");
    setImagePreview(null);
  }

  function addBlock(type: "text" | "image", atIndex?: number) {
    const newBlock: ContentBlock =
      type === "text"
        ? { type: "text", content: "" }
        : { type: "image", url: "", caption: "" };
    setBlocks((prev) => {
      const next = [...prev];
      const idx = atIndex !== undefined ? atIndex : next.length;
      next.splice(idx, 0, newBlock);
      return next;
    });
  }

  function updateBlock(
    index: number,
    updates: Record<string, string>
  ) {
    setBlocks((prev) =>
      prev.map((b, i) => {
        if (i !== index) return b;
        if (b.type === "text") return { ...b, ...updates } as ContentBlock;
        return { ...b, ...updates } as ContentBlock;
      })
    );
  }

  function moveBlock(index: number, direction: "up" | "down") {
    setBlocks((prev) => {
      const next = [...prev];
      const swapIndex = direction === "up" ? index - 1 : index + 1;
      if (swapIndex < 0 || swapIndex >= next.length) return prev;
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
      return next;
    });
  }

  async function removeBlock(index: number) {
    const block = blocks[index];
    if (block.type === "image" && block.url) {
      const path = block.url.split("/media/")[1];
      if (path) await supabase.storage.from("media").remove([path]);
    }
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    setRemoveTarget(null);
  }

  async function handleBlockImageUpload(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBlock(index);
    setError("");
    const ext = file.name.split(".").pop();
    const path = `stories/${Date.now()}-blk.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("media")
      .upload(path, file);

    if (uploadErr) {
      setError(uploadErr.message);
      setUploadingBlock(null);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(path);
    updateBlock(index, { url: publicUrl });
    setUploadingBlock(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: insertErr } = await supabase
      .from("stories")
      .insert([{ ...form, body: JSON.stringify(blocks) }]);

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
                onChange={handleCoverUpload}
                className="w-full bg-charcoal border border-white/10 px-4 py-3 text-sm text-warm-dim/50 file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:bg-crimson/20 file:text-crimson file:cursor-pointer"
              />
              {uploading && (
                <p className="mt-2 text-xs text-warm-dim/40">Uploading...</p>
              )}
            </>
          )}
        </div>

        {/* Story Content — Block Editor */}
        <div>
          <label className="block text-xs tracking-[0.15em] uppercase text-warm-dim/50 mb-2">
            Story Content
          </label>
          <p className="text-xs text-warm-dim/30 mb-4">
            Build your story with text and image blocks. Add, reorder, and
            remove blocks freely.
          </p>

          <div className="border border-white/10 bg-navy/50 p-4 min-h-[120px]">
            {blocks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <p className="text-sm text-warm-dim/30">
                  No content blocks yet.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => addBlock("text")}
                    className="px-4 py-2 text-xs tracking-[0.1em] uppercase bg-white/5 text-warm-dim/60 hover:bg-white/10 hover:text-warm transition-colors"
                  >
                    + Add Text Block
                  </button>
                  <button
                    type="button"
                    onClick={() => addBlock("image")}
                    className="px-4 py-2 text-xs tracking-[0.1em] uppercase bg-white/5 text-warm-dim/60 hover:bg-white/10 hover:text-warm transition-colors"
                  >
                    + Add Image Block
                  </button>
                </div>
              </div>
            )}

            {blocks.map((block, index) => (
              <div key={index}>
                {index === 0 && (
                  <InsertMenu
                    onAdd={(type) => addBlock(type, 0)}
                  />
                )}
                <div className="bg-charcoal border border-white/10 mb-1">
                  {/* Block header */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.6rem] tracking-[0.15em] uppercase text-warm-dim/40">
                        {block.type === "text" ? "Text" : "Image"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, "up")}
                        disabled={index === 0}
                        className="px-1.5 py-0.5 text-xs text-warm-dim/40 hover:text-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        &uarr;
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, "down")}
                        disabled={index === blocks.length - 1}
                        className="px-1.5 py-0.5 text-xs text-warm-dim/40 hover:text-warm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        &darr;
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (block.type === "image" && block.url) {
                            setRemoveTarget(index);
                          } else {
                            removeBlock(index);
                          }
                        }}
                        className="px-1.5 py-0.5 text-xs text-red-400/60 hover:text-red-400 transition-colors ml-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Block body */}
                  <div className="p-3">
                    {block.type === "text" ? (
                      <textarea
                        value={block.content}
                        onChange={(e) =>
                          updateBlock(index, { content: e.target.value })
                        }
                        rows={4}
                        className="w-full bg-navy border border-white/10 px-4 py-3 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50 resize-y min-h-[100px]"
                        placeholder="Write your text here..."
                      />
                    ) : block.url ? (
                      <div>
                        <img
                          src={block.url}
                          alt={block.caption || "Block image"}
                          className="max-h-48 object-cover border border-white/10 mb-3"
                        />
                        <input
                          type="text"
                          value={block.caption}
                          onChange={(e) =>
                            updateBlock(index, { caption: e.target.value })
                          }
                          placeholder="Image caption (e.g. Lagos skyline — Photo by John Doe)"
                          className="w-full bg-navy border border-white/10 px-3 py-2 text-sm text-warm placeholder:text-warm-dim/30 focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50"
                        />
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBlockImageUpload(index, e)}
                          className="w-full bg-navy border border-white/10 px-4 py-3 text-sm text-warm-dim/50 file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:bg-crimson/20 file:text-crimson file:cursor-pointer"
                        />
                        {uploadingBlock === index && (
                          <p className="mt-2 text-xs text-warm-dim/40">
                            Uploading...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <InsertMenu
                  onAdd={(type) => addBlock(type, index + 1)}
                />
              </div>
            ))}

            {blocks.length > 0 && (
              <div className="flex gap-2 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => addBlock("text")}
                  className="px-3 py-1.5 text-xs tracking-[0.1em] uppercase bg-white/5 text-warm-dim/60 hover:bg-white/10 hover:text-warm transition-colors"
                >
                  + Text Block
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("image")}
                  className="px-3 py-1.5 text-xs tracking-[0.1em] uppercase bg-white/5 text-warm-dim/60 hover:bg-white/10 hover:text-warm transition-colors"
                >
                  + Image Block
                </button>
              </div>
            )}
          </div>
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
                  handleCoverRemove();
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

      {/* Block image remove modal */}
      {removeTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-charcoal border border-white/10 p-6 max-w-sm w-full mx-4">
            <p className="text-sm text-warm mb-6">
              Are you sure you want to remove this image block? The image will
              be deleted from storage.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRemoveTarget(null)}
                className="px-5 py-2 text-xs tracking-[0.1em] uppercase text-warm-dim/50 border border-white/10 hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => removeBlock(removeTarget)}
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
