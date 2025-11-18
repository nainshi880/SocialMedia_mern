import { useState, useMemo, useRef } from "react";
import { request } from "../api";
import { GalleryIcon, LinkIcon } from "./Icons";

export default function PostForm({ token, onCreated }) {
  const [text, setText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const previewUrl = useMemo(() => {
    if (mediaFile) {
      return URL.createObjectURL(mediaFile);
    }
    return mediaUrl || null;
  }, [mediaFile, mediaUrl]);

  const [showUrlInput, setShowUrlInput] = useState(false);
  const clearMedia = () => {
    setMediaFile(null);
    setMediaUrl("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaUrl("");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const body =
        mediaFile || mediaUrl
          ? (() => {
              const form = new FormData();
              form.append("content", text);
              if (mediaFile) {
                form.append("media", mediaFile);
              } else if (mediaUrl) {
                form.append("mediaUrl", mediaUrl);
              }
              return form;
            })()
          : { content: text };

      const post = await request("/posts", {
        method: "POST",
        token,
        body
      });
      onCreated(post);
      setText("");
      clearMedia();
    } catch (err) {
      alert("Failed to create post: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#eef0f5] rounded-[32px] shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#0a65ff]/15 text-[#0a65ff] font-semibold flex items-center justify-center">
          +
        </div>
        <div>
          <p className="font-semibold text-[#0a1b33]">Share something new</p>
          <p className="text-xs text-gray-700">What’s on your mind?</p>
        </div>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <div className="relative space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe what you’re up to..."
            className="w-full bg-[#f7f8fc] border border-transparent focus:border-[#cfd6e4] focus:ring-0 rounded-2xl px-20 py-3 pr-36 pb-3 text-sm text-[#0a1b33] resize-none"
            rows="3"
            required
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="absolute top-2 right-3 px-4 py-1.5 rounded-2xl bg-[#0a65ff] text-white text-xs font-semibold shadow-[0_10px_20px_rgba(10,101,255,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "..." : "Post"}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute top-3 left-3 text-gray-500 hover:text-[#0a65ff] transition cursor-pointer"
            aria-label="Add media"
          >
            <GalleryIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput((prev) => !prev)}
            className="absolute top-3 left-11 text-gray-500 hover:text-[#0a65ff] transition cursor-pointer"
            aria-label="Add link"
          >
            <LinkIcon className="w-5 h-5" />
          </button>
         
        </div>
        {showUrlInput && (
          <div className="rounded-2xl bg-[#f7f8fc] p-3 space-y-2">
            <label className="text-xs text-gray-600 font-medium">Paste image or video URL</label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => {
                setMediaUrl(e.target.value);
                if (e.target.value) {
                  setMediaFile(null);
                }
              }}
              placeholder="https://example.com/media.jpg"
              className="w-full bg-white border border-[#e2e6f0] focus:border-[#cfd6e4] focus:ring-0 rounded-xl px-3 py-2 text-sm text-[#0a1b33]"
            />
          </div>
        )}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />
        {previewUrl && (
          <div className="rounded-2xl overflow-hidden bg-[#f7f8fc] p-3">
            {mediaFile?.type?.startsWith("video") ||
            (!mediaFile && /\.(mp4|mov|webm|ogg)$/i.test(mediaUrl)) ? (
              <video src={previewUrl} controls className="w-full rounded-xl max-h-64 object-cover" />
            ) : (
              <img src={previewUrl} alt="Preview" className="w-full rounded-xl max-h-64 object-cover" />
            )}
            <button
              type="button"
              onClick={clearMedia}
              className="mt-2 text-xs font-medium text-[#f1556c] hover:underline cursor-pointer"
            >
              Remove media
            </button>
          </div>
        )}
        <div className="flex justify-end"></div>
      </form>
    </div>
  );
}
