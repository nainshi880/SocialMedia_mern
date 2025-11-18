import { useState, useEffect, useRef } from "react";
import { request } from "../api";
import { useNavigate } from "react-router-dom";
import { HeartIcon, CommentIcon, SendIcon, MoreVerticalIcon, EditIcon, TrashIcon } from "./Icons";

export default function PostItem({ post, token, onUpdate, currentUserId }) {
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editMediaUrl, setEditMediaUrl] = useState(post.media?.url || post.image || "");
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const nav = useNavigate();

  const isAuthor = post.author._id === currentUserId || post.author === currentUserId;

  const like = async () => {
    if (!token) {
      nav("/login");
      return;
    }
    try {
      await request(`/posts/${post._id}/like`, { method: "POST", token });
      onUpdate();
    } catch (err) {
      alert("Failed to like post");
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!token) {
      nav("/login");
      return;
    }
    if (!comment.trim()) return;
    try {
      await request(`/posts/${post._id}/comment`, {
        method: "POST",
        token,
        body: { text: comment }
      });
      setComment("");
      onUpdate();
    } catch (err) {
      alert("Failed to add comment");
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await request(`/posts/${post._id}`, {
        method: "PUT",
        token,
        body: { content: editContent, mediaUrl: editMediaUrl || undefined }
      });
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      alert("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await request(`/posts/${post._id}`, { method: "DELETE", token });
      onUpdate();
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  const liked = post.likes && post.likes.some(
    like => (typeof like === 'object' ? like._id : like) === currentUserId
  );

  return (
    <div className="bg-white border border-[#eef0f5] rounded-[32px] shadow-sm p-6">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#f2f4f8] rounded-full flex items-center justify-center text-[#0a65ff] font-semibold">
            {post.author?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-semibold text-[#0a1b33]">
              {post.author?.username || "Unknown"}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        {isAuthor && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-[#f2f4f8] text-gray-500"
              aria-label="More options"
            >
              <MoreVerticalIcon className="w-5 h-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-[#eef0f5] rounded-2xl shadow-lg text-sm z-10">
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#f7f8fc] text-[#0a65ff] flex items-center gap-2"
                >
                  <EditIcon className="w-4 h-4" />
                  {isEditing ? "Close edit" : "Edit"}
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleDelete();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#f7f8fc] text-red-500 flex items-center gap-2"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="space-y-4 mb-5">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 border rounded-2xl focus:ring-0 focus:border-[#cfd6e4] resize-none"
            rows="4"
          />
          <input
            type="url"
            value={editMediaUrl}
            onChange={(e) => setEditMediaUrl(e.target.value)}
            placeholder="Media URL (optional)"
            className="w-full p-3 border rounded-2xl focus:ring-0 focus:border-[#cfd6e4]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-[#0a65ff] text-white px-4 py-2 rounded-2xl hover:bg-[#084fcb] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditContent(post.content);
                setEditMediaUrl(post.media?.url || post.image || "");
              }}
              className="bg-[#f2f4f8] text-gray-700 px-4 py-2 rounded-2xl cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800 mb-4 whitespace-pre-wrap text-[15px] leading-relaxed">
            {post.content}
          </p>
          {post.media?.url ? (
            post.media.type === "video" ? (
              <video
                src={post.media.url}
                controls
                className="w-full rounded-2xl mb-5 max-h-96 object-cover"
              />
            ) : (
              <img
                src={post.media.url}
                alt="Post"
                className="w-full rounded-2xl mb-5 max-h-96 object-cover"
              />
            )
          ) : (
            post.image && (
              <img
                src={post.image}
                alt="Post"
                className="w-full rounded-2xl mb-5 max-h-96 object-cover"
              />
            )
          )}
        </>
      )}

      {/* Like Button */}
      <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#f1f3f7]">
        <button
          onClick={like}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition ${
            liked
              ? "text-[#f1556c]"
              : "text-gray-600"
          }`}
        >
          <HeartIcon className="w-5 h-5" filled={liked} />
          <span>{post.likes?.length || 0} Likes</span>
        </button>
        <button
          type="button"
          onClick={() => setShowComments((prev) => !prev)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#0a65ff] transition text-sm"
        >
          <CommentIcon className="w-5 h-5" />
          <span>{post.comments?.length || 0}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <>
          <div className="space-y-3 mb-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((c) => (
                <div key={c._id} className="bg-[#f7f8fc] p-3 rounded-2xl text-sm">
                  <p className="font-semibold text-[#0a1b33]">
                    {c.user?.username || "Unknown"}
                  </p>
                  <p className="text-gray-600">{c.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No comments yet</p>
            )}
          </div>

          {/* Comment Form */}
          {token ? (
            <form onSubmit={submitComment} className="flex gap-3">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-[#f7f8fc] border border-transparent focus:border-[#cfd6e4] focus:ring-0 rounded-2xl px-4 py-3 text-sm"
              />
              <button
                type="submit"
                disabled={!comment.trim()}
                className="bg-[#0a65ff] text-white px-4 py-3 rounded-2xl disabled:opacity-50 cursor-pointer flex items-center justify-center"
                aria-label="Post comment"
              >
                <SendIcon className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <p className="text-center text-gray-500 text-sm">
              <span
                className="text-[#0a65ff] cursor-pointer hover:underline"
                onClick={() => nav("/login")}
              >
                Login
              </span>{" "}
              to comment
            </p>
          )}
        </>
      )}
    </div>
  );
}
