import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCamera, FiLogOut, FiSave } from "react-icons/fi";
import { API_ENDPOINTS } from "../config/api";
import { apiRequest } from "../services/apiClient";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setNewUsername(user.username || "");
      setBio(user.bio || "");
      setIsLoading(false);
    }
  }, [user]);

  const handleEditProfile = async () => {
    try {
      const updatedUser = await apiRequest(API_ENDPOINTS.UPDATE_PROFILE, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername, bio }),
      });
      setUser(updatedUser.user);
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
    } catch (error) {
      // surface via UI later
    }
  };

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const updatedUser = await apiRequest(API_ENDPOINTS.UPLOAD_PROFILE_PIC, {
        method: "POST",
        body: formData,
      });
      setUser(updatedUser.user);
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
    } catch (error) {
      // surface via UI later
    }

    event.target.value = "";
  };

  const handleLogout = async () => {
    try {
      await apiRequest(API_ENDPOINTS.LOGOUT, {
        method: "POST",
      });

      // Clear user data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      // surface via UI later
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-5xl items-center justify-center px-4">
        <div className="rounded-3xl border border-white/10 bg-[rgba(var(--panel)/0.55)] px-6 py-4 text-sm text-[rgb(var(--muted))] backdrop-blur-2xl">
          Loading profile…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] px-4 pb-12 pt-20">
      <div className="fixed top-0 z-40 w-full border-b border-white/10 bg-[rgba(var(--panel)/0.55)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[rgb(var(--text))] hover:bg-white/10 active:scale-95"
              onClick={() => navigate("/")}
              aria-label="Back"
            >
              <FiArrowLeft className="text-lg" />
            </button>
            <div>
              <div className="text-base font-semibold text-[rgb(var(--text))]">Profile</div>
              <div className="text-xs text-[rgb(var(--muted))]">Your identity on Convo.</div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[rgb(var(--text))] hover:bg-white/10 active:scale-95"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl pt-6">
        {profileData ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(var(--panel)/0.55)] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.75)] backdrop-blur-2xl md:p-7"
          >
            <div className="pointer-events-none absolute -top-28 -right-14 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_0%_0%,rgba(var(--primary)/0.55),transparent_62%)] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_100%_100%,rgba(var(--accent)/0.50),transparent_62%)] blur-3xl" />

            <div className="relative z-10 grid gap-5 md:grid-cols-[260px,1fr] md:gap-7">
              <div className="rounded-3xl border border-white/10 bg-[rgba(var(--panel2)/0.75)] p-5 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={profileData.profilePicture || "./profile.jpg"}
                      alt="profile"
                      className="h-18 w-18 h-[72px] w-[72px] rounded-3xl object-cover ring-1 ring-white/10"
                      onError={(e) => {
                        e.currentTarget.src = "./profile.jpg";
                      }}
                    />
                    <span className="pointer-events-none absolute inset-[-2px] rounded-3xl ring-2 ring-[rgba(var(--ring)/0.22)]" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-lg font-semibold text-[rgb(var(--text))]">
                      {profileData.username}
                    </div>
                    <div className="truncate text-xs text-[rgb(var(--muted))]">{profileData.email}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                    <div className="text-base font-semibold text-[rgb(var(--text))]">
                      {profileData.followers?.length || 0}
                    </div>
                    <div className="text-[11px] text-[rgb(var(--muted))]">Followers</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center">
                    <div className="text-base font-semibold text-[rgb(var(--text))]">
                      {profileData.following?.length || 0}
                    </div>
                    <div className="text-[11px] text-[rgb(var(--muted))]">Following</div>
                  </div>
                </div>

                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1 }}
                  onClick={() => document.getElementById("file-upload").click()}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-[rgb(var(--text))] hover:bg-white/10"
                >
                  <FiCamera />
                  Change picture
                </motion.button>
              </div>

              <div className="rounded-3xl border border-white/10 bg-[rgba(var(--panel2)/0.70)] p-5 backdrop-blur-xl md:p-6">
                <div className="mb-4">
                  <div className="text-sm font-semibold text-[rgb(var(--text))]">Edit profile</div>
                  <div className="mt-1 text-xs text-[rgb(var(--muted))]">
                    Keep it minimal. Your bio appears across Convo.
                  </div>
                </div>

                <div className="grid gap-3">
                  <label className="block text-xs text-[rgb(var(--muted))]">
                    Username
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Your username"
                      className="mt-1 h-10 w-full rounded-2xl border border-white/10 bg-white/5 px-3 text-sm text-[rgb(var(--text))] outline-none placeholder:text-[rgb(var(--muted))] focus:ring-2 focus:ring-[rgba(var(--ring)/0.45)]"
                    />
                  </label>

                  <label className="block text-xs text-[rgb(var(--muted))]">
                    Bio
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a short bio…"
                      rows={4}
                      className="mt-1 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[rgb(var(--text))] outline-none placeholder:text-[rgb(var(--muted))] focus:ring-2 focus:ring-[rgba(var(--ring)/0.45)]"
                    />
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ y: -1 }}
                    onClick={handleEditProfile}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] px-4 py-2 text-xs font-semibold text-black shadow-[0_18px_45px_rgba(0,0,0,0.55)] hover:brightness-110"
                  >
                    <FiSave />
                    Save changes
                  </motion.button>

                  <button
                    type="button"
                    onClick={() => navigate("/messages")}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-[rgb(var(--text))] hover:bg-white/10 active:scale-95"
                  >
                    Open Messages
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-[rgba(var(--panel)/0.55)] p-6 text-center text-sm text-[rgb(var(--muted))] backdrop-blur-2xl">
            Profile not found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
