import React, { useEffect, useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { AiOutlineHome, AiOutlineUser, AiOutlinePlusCircle } from "react-icons/ai";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import { useTheme } from "../ui/theme/ThemeProvider.jsx";

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

		setFollowing([...following, id]);
	};

	return (
		<div className="pt-16 pb-16 h-screen-fit">
			<Navbar newMessagesCount={newMessagesCount} />
			<div className="max-w-md  mx-auto p-4">
				{users.length > 0 ? (
					users.map((user) => (
						<PostCard
							key={user._id}
							user={user}
							following={following}
							handleFollow={handleFollow}
						/>
					))
				) : (
					<p className="text-center text-gray-500 bg-black">Loading...</p>
				)}
			</div>

			<BottomNav />
		</div>
	);
};

// Navbar Component
function Navbar({ newMessagesCount }) {
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme();

	return (
		<nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[rgba(var(--panel)/0.55)] backdrop-blur-xl">
			<div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
				{/* Left: Logo */}
				<div className="flex flex-col items-center  cursor-pointer" onClick={() => navigate("/")}>
					<img src="./chat.jpg" alt="logo" className="w-16 h-12 rounded-[500px] backdrop-blur-sm" />
				</div>

				{/* Center: App Name */}
				<h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
					<span className="bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] bg-clip-text text-transparent">
						Convo
					</span>
					<img src="./chat.jpg" className="h-8 w-8 rounded-full opacity-90" />
				</h1>

				{/* Right: theme toggle + chat icon */}
				<div className="flex items-center gap-2">
					<button
						onClick={toggleTheme}
						className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-[rgb(var(--muted))] hover:bg-white/10 hover:text-[rgb(var(--text))]"
						aria-label="Toggle theme"
					>
						{theme === "dark" ? "Light" : "Dark"}
					</button>
					<div className="relative cursor-pointer" onClick={() => navigate("/messages")}>
						<FiMessageCircle className="text-3xl text-[rgb(var(--text))]" />
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

// Post Card Component
const PostCard = ({ user, following, handleFollow }) => {
	const isFollowing = following.includes(user._id);
	const navigate = useNavigate();

	return (
		<div className="bg-black shadow-lg rounded-lg overflow-hidden my-4 p-3">
			<div className="flex items-center justify-between border-1 border-white p-5 rounded-4xl">
				<div className="flex items-center">
					<img
						src={user.profilePicture || "./profile.jpg"}
						className="w-10 h-10 bg-gray-300 rounded-full"
						alt="profile"
					/>
					<p className="ml-3 font-semibold text-white">{user.username}</p>
				</div>

				{isFollowing ? (
					<button className="bg-gray-300 text-black px-3 py-1 rounded text-sm">
						Following
					</button>
				) : (
					<button
						className="bg-blue-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
						onClick={() => handleFollow(user._id)}
					>
						Follow
					</button>
				)}
			</div>

			<div className="p-3 flex justify-between">
				<p className="text-sm text-white">
					<span className="font-semibold text-white">{user.username}</span> Just joined
					Convo!
				</p>
			</div>
		</div>
	);
};

// Bottom Navigation
function BottomNav() {
	const navigate = useNavigate();

	return (
		<div className="bg-black fixed bottom-0 w-full p-3 flex justify-around text-2xl text-gray-700 border-t">
			<AiOutlineHome
				className="text-white cursor-pointer hover:text-gray-400"
				onClick={() => navigate("/")}
			/>
			<MdOutlineSlowMotionVideo
				className="text-white cursor-pointer hover:text-gray-400"
				onClick={() => navigate("/reels")}
			/>
			<AiOutlinePlusCircle className="text-white cursor-pointer hover:text-gray-400" onClick={() => navigate("/post")}/>
			<AiOutlineUser
				className="text-white cursor-pointer hover:text-gray-400"
				onClick={() => navigate("/profile")}
			/>
		</div>
	);
}

export default Home;
