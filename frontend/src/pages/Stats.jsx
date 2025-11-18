import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { request } from "../api";

export default function Stats() {
  const { type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadUser();
    // Use posts from location state if available, otherwise fetch all posts
    if (location.state) {
      const statePosts = type === "likes" ? location.state.likedPosts : location.state.commentedPosts;
      if (statePosts && statePosts.length > 0) {
        setPosts(statePosts);
        setLoading(false);
        return;
      }
    }
    loadPosts();
  }, [type, location.state]);

  const loadUser = () => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const user = JSON.parse(saved);
      setCurrentUser(user.id || user._id);
    } else {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUser(payload.id);
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  };

  const loadPosts = async () => {
    try {
      const data = await request("/posts", { token });
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const title = type === "likes" ? "Likes Overview" : "Comments Overview";
  const description =
    type === "likes"
      ? "See how many likes each of your posts received."
      : "See how many comments each of your posts received.";

  const authorPosts = posts.filter(
    (post) =>
      post.author?._id === currentUser ||
      post.author === currentUser ||
      post.author?.id === currentUser
  );

  const data = authorPosts.map((post) => ({
    id: post._id,
    content: post.content,
    count: type === "likes" ? post.likes?.length || 0 : post.comments?.length || 0
  }));

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0a1b33]">{title}</h1>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <button
            onClick={() => navigate("/feed")}
            className="px-4 py-2 rounded-full border border-[#dfe3ec] text-sm font-medium text-[#0a65ff] hover:bg-white"
          >
            Back to Feed
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-[32px] p-10 text-center text-gray-500">
            Loading...
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-[32px] p-10 text-center text-gray-500">
            {type === "likes"
              ? "No likes yet on your posts."
              : "No comments yet on your posts."}
          </div>
        ) : (
          <div className="space-y-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#eef0f5] rounded-[28px] p-5 flex items-center justify-between shadow-sm"
              >
                <p className="text-[#0a1b33] text-sm pr-6 truncate">
                  {item.content}
                </p>
                <span className="text-xl font-bold text-[#0a65ff]">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

