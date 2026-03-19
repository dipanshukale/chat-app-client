import React, { useEffect, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineHome, AiOutlineUser, AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import { useTheme } from "../ui/theme/ThemeProvider.jsx";
import { listItem, listStagger } from "../ui/motion/presets.js";
import { ConvoMark } from "../ui/brand/ConvoMark.jsx";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  useEffect(() => {
    const fetchMessagesCount = () => {
      fetch(API_ENDPOINTS.UNREAD_MESSAGES, {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => setNewMessagesCount(data.count))
        .catch((error) => console.error("Error fetching messages:", error));
    };

    fetchMessagesCount();

    const interval = setInterval(fetchMessagesCount, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch users & following list
  useEffect(() => {
    fetch(API_ENDPOINTS.USERS, {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));

    fetch(API_ENDPOINTS.PROFILE, {
      method: "GET",
      credentials: "include",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setFollowing(data.following));
  }, []);

  const handleFollow = async (id) => {
    await fetch(API_ENDPOINTS.FOLLOW(id), {
      method: "POST",
      credentials: "include",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    setFollowing((prev) => [...prev, id]);
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col">
      <Navbar newMessagesCount={newMessagesCount} />

      <main className="relative z-0 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 pb-20 pt-20 md:flex-row md:pb-10 md:pt-24">
        <section className="mb-4 w-full md:mb-0 md:w-[42%]">
          <div className="mb-4 rounded-3xl border border-white/10 bg-[rgba(var(--panel)/0.6)] p-5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[rgb(var(--muted))]">
              Focused messaging
            </p>
            <h2 className="mt-2 bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--accent))] to-[rgb(var(--primary))] bg-clip-text text-2xl font-semibold leading-snug text-transparent md:text-3xl">
              Welcome back to Convo
            </h2>
            <p className="mt-2 text-sm text-[rgb(var(--muted))]">
              Pick someone to follow and your conversations will appear in the Messages panel.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[rgba(var(--panel)/0.55)] p-4 text-left backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-[rgb(var(--text))]">People on Convo</h3>
                <p className="text-xs text-[rgb(var(--muted))]">Follow to start a conversation.</p>
              </div>
            </div>

            {users.length > 0 ? (
              <motion.div
                variants={listStagger}
                initial="initial"
                animate="animate"
                className="grid gap-2"
              >
                {users.map((user) => (
                  <PostCard
                    key={user._id}
                    user={user}
                    following={following}
                    handleFollow={handleFollow}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/10 px-4 py-8 text-center text-xs text-[rgb(var(--muted))]">
                Loading people…
              </div>
            )}
          </div>
        </section>

        <section className="flex w-full items-center justify-center md:w-[58%]">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[rgba(var(--panel2)/0.72)] px-7 py-10 text-center shadow-[0_26px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute -top-16 right-2 h-28 w-28 rounded-full bg-[radial-gradient(circle_at_0%_0%,rgba(var(--primary)/0.7),transparent_65%)] opacity-70 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-6 h-32 w-32 rounded-full bg-[radial-gradient(circle_at_100%_100%,rgba(var(--accent)/0.7),transparent_65%)] opacity-70 blur-3xl" />

            <div className="relative z-10 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(0,0,0,0.5)] ring-1 ring-white/10">
                <FiMessageCircle className="text-2xl text-[rgb(var(--primary))]" />
              </div>
              <h2 className="text-xl font-semibold text-[rgb(var(--text))] md:text-2xl">
                Start a conversation
              </h2>
              <p className="mx-auto max-w-sm text-sm text-[rgb(var(--muted))]">
                Select a user from the list on the left, follow them, and then head to your Messages
                to begin messaging.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <PrimaryButton />
                <p className="text-[11px] text-[rgb(var(--muted))]">
                  Calm dark theme by default — light mode whenever you need it.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

// Navbar Component
function Navbar({ newMessagesCount }) {
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme();
  const location = useLocation();

	return (
		<nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[rgba(var(--panel)/0.55)] backdrop-blur-xl">
			<div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
				<button
          type="button"
          className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-left hover:bg-white/10 active:scale-[0.99]"
          onClick={() => navigate("/")}
          aria-label="Go to Home"
        >
          <ConvoMark size={16} className="ring-1 ring-white/10" />
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] bg-clip-text text-sm font-semibold tracking-tight text-transparent">
                Convo
              </span>
              <span className="hidden text-[10px] text-[rgb(var(--muted))] sm:inline">
                Premium messaging
              </span>
            </div>
            <div className="text-[10px] text-[rgb(var(--muted))]">
              {location.pathname === "/" ? "Home" : "Focused workspace"}
            </div>
          </div>
        </button>

				{/* Right: theme toggle + chat icon */}
				<div className="flex items-center gap-2">
					<button
						onClick={toggleTheme}
						className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-[rgb(var(--muted))] hover:bg-white/10 hover:text-[rgb(var(--text))] active:scale-95"
						aria-label="Toggle theme"
					>
						<span
							className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-tr from-[rgb(var(--primary))] to-[rgb(var(--accent))]"
						/>
						<span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
					</button>
					<div className="relative cursor-pointer" onClick={() => navigate("/messages")}>
						<motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}>
              <FiMessageCircle className="text-3xl text-[rgb(var(--text))]" />
            </motion.div>
						{newMessagesCount > 0 && (
							<span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[rgb(var(--danger))] text-xs font-bold text-black">
								{newMessagesCount}
							</span>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}

// CTA primary button
function PrimaryButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate("/messages")}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] px-5 py-2 text-sm font-semibold text-black shadow-[0_18px_45px_rgba(0,0,0,0.6)] transition hover:brightness-110 active:scale-95"
    >
      Open Messages
    </button>
  );
}

// Post Card Component
const PostCard = ({ user, following, handleFollow }) => {
  const isFollowing = following.includes(user._id);

  return (
    <motion.div
      variants={listItem}
      className="flex items-center justify-between rounded-2xl border border-white/10 bg-[rgba(var(--panel2)/0.8)] px-3 py-3 text-sm shadow-[0_16px_45px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <img
          src={user.profilePicture || "./profile.jpg"}
          className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
          alt={user.username}
        />
        <div>
          <p className="text-sm font-semibold text-[rgb(var(--text))]">{user.username}</p>
          <p className="text-[11px] text-[rgb(var(--muted))]">Just joined Convo</p>
        </div>
      </div>

      {isFollowing ? (
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-[rgb(var(--text))]">
          Following
        </span>
      ) : (
        <button
          type="button"
          className="rounded-full bg-[rgb(var(--primary))] px-3 py-1 text-[11px] font-semibold text-black shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:brightness-110 active:scale-95"
          onClick={() => handleFollow(user._id)}
        >
          Follow
        </button>
      )}
    </motion.div>
  );
};

// Bottom Navigation
function BottomNav() {
	const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: "home", to: "/", label: "Home", Icon: AiOutlineHome },
    { key: "reels", to: "/reels", label: "Reels", Icon: MdOutlineSlowMotionVideo },
    { key: "post", to: "/post", label: "Post", Icon: AiOutlinePlusCircle },
    { key: "profile", to: "/profile", label: "Profile", Icon: AiOutlineUser },
  ];

  const isActive = (to) => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to));

	return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto w-fit px-3">
        <div className="flex items-center gap-1.5 rounded-[26px] border border-white/10 bg-[rgba(var(--panel)/0.55)] p-2 shadow-[0_20px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
          {items.map(({ key, to, label, Icon }) => {
            const active = isActive(to);
            return (
              <motion.button
                key={key}
                type="button"
                onClick={() => navigate(to)}
                aria-label={label}
                whileTap={{ scale: 0.92 }}
                whileHover={{ y: -1 }}
                className={[
                  "relative inline-flex h-12 w-12 items-center justify-center rounded-2xl",
                  "border border-white/10",
                  active
                    ? "bg-[radial-gradient(circle_at_0%_0%,rgba(var(--primary)/0.50),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(var(--accent)/0.35),transparent_55%)] text-[rgb(var(--text))]"
                    : "bg-white/5 text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] hover:bg-white/10",
                ].join(" ")}
              >
                <Icon className="text-[22px]" />
                {active ? (
                  <motion.span
                    layoutId="navActiveGlow"
                    className="pointer-events-none absolute inset-[-2px] rounded-2xl ring-2 ring-[rgba(var(--ring)/0.25)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
	);
}

export default Home;
