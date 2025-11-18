import { useEffect, useState, useRef } from "react";
import { request } from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import PostForm from "../components/PostForm";
import PostItem from "../components/PostItem";
import { HeartIcon, CommentIcon, UserIcon, SearchIcon } from "../components/Icons";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserName, setCurrentUserName] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const [totalLikes, setTotalLikes] = useState(null);
  const [totalComments, setTotalComments] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [commentedPosts, setCommentedPosts] = useState([]);
  const [highlightedPostIds, setHighlightedPostIds] = useState(new Set());
  const postRefs = useRef({});
  const location = useLocation();
  const token = localStorage.getItem("token");
  const nav = useNavigate();

  useEffect(() => {
    if (!token) {
      nav("/login");
      return;
    }
    loadPosts();
    loadUser();
  }, []);

  // Handle navigation from navbar icons - scroll to highlighted posts
  useEffect(() => {
    if (location.state && location.state.highlightPosts) {
      const postIds = location.state.highlightPosts.map(p => p._id || p.id);
      setHighlightedPostIds(new Set(postIds));
      
      // Scroll to first highlighted post after a short delay
      setTimeout(() => {
        if (postIds.length > 0) {
          const firstPostId = postIds[0];
          const postElement = postRefs.current[firstPostId];
          if (postElement) {
            postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setHighlightedPostIds(new Set());
      }, 3000);
    }
  }, [location.state]);

  const loadPosts = async () => {
    try {
      const data = await request("/posts", { token });
      setPosts(data);
      if (currentUser) {
        calculateTotals(data, currentUser);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data, userId) => {
    if (!userId) return;
    let likes = 0;
    let comments = 0;
    const liked = [];
    const commented = [];
    data.forEach((post) => {
      const isOwner =
        post.author?._id === userId ||
        post.author === userId ||
        post.author?.id === userId;
      if (isOwner) {
        const likeCount = post.likes?.length || 0;
        const commentCount = post.comments?.length || 0;
        likes += likeCount;
        comments += commentCount;
        if (likeCount > 0) {
          liked.push(post);
        }
        if (commentCount > 0) {
          commented.push(post);
        }
      }
    });
    setTotalLikes(likes || null);
    setTotalComments(comments || null);
    setLikedPosts(liked);
    setCommentedPosts(commented);
  };

  const loadUser = async () => {
    try {
      // Decode token to get user ID
      const saved = localStorage.getItem("user");
      let userId;
      if (saved) {
        const user = JSON.parse(saved);
        userId = user.id || user._id;
        setCurrentUser(userId);
        setCurrentUserName(user.username || "");
      } else {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.id;
        setCurrentUser(userId);
        setCurrentUserName("hii");
      }
      // Recalculate totals with the user ID
      if (posts.length > 0 && userId) {
        calculateTotals(posts, userId);
      }
    } catch (err) {
      console.error("Failed to load user:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    nav("/login");
  };

  useEffect(() => {
    const listener = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Recalculate totals when both posts and currentUser are available
  useEffect(() => {
    if (posts.length > 0 && currentUser) {
      calculateTotals(posts, currentUser);
    }
  }, [posts, currentUser]);

  const normalizedTerm = searchTerm.trim().toLowerCase();
  const filteredPosts = normalizedTerm
    ? posts.filter((post) => {
        const authorMatch = post.author?.username?.toLowerCase().includes(normalizedTerm);
        const contentMatch = post.content?.toLowerCase().includes(normalizedTerm);
        return authorMatch || contentMatch;
      })
    : posts;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading your feed...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fc]">

      {/* Top Navigation */}
      <header className="bg-white border-b border-[#edf0f5]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0a65ff]/10 text-[#0a65ff] font-semibold flex items-center justify-center">S</div>
            <div>
              <p className="text-lg font-semibold text-[#0a1b33]">Social</p>
              <p className="text-xs text-gray-500">Social Media API Development</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2" ref={searchRef}>
              {searchOpen ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2f4f8] text-sm text-[#0a1b33]">
                  <SearchIcon className="w-4 h-4" />
                  <input
                    ref={searchInputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search posts or authors"
                    className="bg-transparent outline-none text-sm text-[#0a1b33] w-48"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="text-xs text-[#0a65ff] hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f2f4f8] text-sm font-medium text-[#0a1b33] cursor-pointer"
                >
                  <SearchIcon className="w-4 h-4" />
                  Search
                </button>
              )}
            </div>
            <button
              onClick={() => {
                if (likedPosts.length) {
                  const postIds = likedPosts.map(p => p._id);
                  setHighlightedPostIds(new Set(postIds));
                  setTotalLikes(null);
                  
                  // Scroll to first liked post
                  setTimeout(() => {
                    if (postIds.length > 0) {
                      const firstPostId = postIds[0];
                      const postElement = postRefs.current[firstPostId];
                      if (postElement) {
                        postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }
                  }, 100);
                  
                  // Clear highlight after 3 seconds
                  setTimeout(() => {
                    setHighlightedPostIds(new Set());
                  }, 3000);
                }
              }}
              className="relative w-10 h-10 rounded-full bg-[#f2f4f8] flex items-center justify-center text-[#0a1b33] hover:text-[#0a65ff] transition cursor-pointer"
              aria-label="Likes"
            >
              <HeartIcon className="w-5 h-5" />
              {totalLikes ? (
                <span className="absolute -top-1 -right-1 bg-[#0a65ff] text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5">
                  {totalLikes}
                </span>
              ) : null}
            </button>
            <button
              onClick={() => {
                if (commentedPosts.length) {
                  const postIds = commentedPosts.map(p => p._id);
                  setHighlightedPostIds(new Set(postIds));
                  setTotalComments(null);
                  
                  // Scroll to first commented post
                  setTimeout(() => {
                    if (postIds.length > 0) {
                      const firstPostId = postIds[0];
                      const postElement = postRefs.current[firstPostId];
                      if (postElement) {
                        postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }
                  }, 100);
                  
                  // Clear highlight after 3 seconds
                  setTimeout(() => {
                    setHighlightedPostIds(new Set());
                  }, 3000);
                }
              }}
              className="relative w-10 h-10 rounded-full bg-[#f2f4f8] flex items-center justify-center text-[#0a1b33] hover:text-[#0a65ff] transition cursor-pointer"
              aria-label="Comments"
            >
              <CommentIcon className="w-5 h-5" />
              {totalComments ? (
                <span className="absolute -top-1 -right-1 bg-[#0a65ff] text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5">
                  {totalComments}
                </span>
              ) : null}
            </button>
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#edf0f5] text-sm font-medium text-[#0a1b33] cursor-pointer"
              >
                <UserIcon className="w-5 h-5" />
                {currentUserName || "hii"}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-36 bg-white border border-[#edf0f5] rounded-2xl shadow-lg py-2 text-sm">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-[#f7f8fc] text-[#d64545] cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <PostForm token={token} onCreated={(p) => setPosts([p, ...posts])} />

        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-[#eef0f5] rounded-[32px] p-10 text-center text-gray-500">
            {normalizedTerm ? "No posts match your search." : "No posts yet. Be the first to share something!"}
          </div>
        ) : (
          filteredPosts.map((p) => (
            <div
              key={p._id}
              ref={(el) => (postRefs.current[p._id] = el)}
              className={`transition-all duration-500 ${
                highlightedPostIds.has(p._id)
                  ? "ring-4 ring-[#0a65ff] ring-opacity-50 rounded-[32px]"
                  : ""
              }`}
            >
              <PostItem
                post={p}
                token={token}
                currentUserId={currentUser}
                onUpdate={loadPosts}
              />
            </div>
          ))
        )}
      </main>
    </div>
  );
}
