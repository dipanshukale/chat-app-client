import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import { apiRequest } from "../services/apiClient";

function AuthShell({ children, title, subtitle }) {
  return (
    <div className="flex min-h-[100dvh] items-stretch justify-center px-4 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[rgba(var(--panel)/0.7)] shadow-[0_30px_120px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <div className="relative hidden w-0 flex-1 flex-col justify-between bg-gradient-to-br from-[rgba(0,0,0,0.85)] via-[rgba(8,12,32,0.96)] to-[rgba(18,22,46,0.98)] px-8 py-8 text-left md:flex md:w-[52%]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] text-[rgb(var(--muted))] ring-1 ring-white/10">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-[rgb(var(--primary))] to-[rgb(var(--accent))] text-[10px] font-semibold text-black">
                C
              </span>
              <span>Premium messaging for focused teams</span>
            </div>

            <h1 className="bg-gradient-to-r from-[rgb(var(--primary))] via-[rgb(var(--accent))] to-[rgb(var(--primary))] bg-clip-text text-3xl font-semibold leading-snug text-transparent">
              Welcome to Convo
            </h1>
            <p className="max-w-sm text-sm text-[rgb(var(--muted))]">
              Glassy UI, smooth transitions, and a calm dark theme by default — with a light mode
              when you want it.
            </p>
          </div>

          <div className="mt-10 space-y-2 text-xs text-[rgb(var(--muted))]">
            <p>• End-to-end conversation focus</p>
            <p>• Opinionated, minimal interface</p>
            <p>• Crafted by Dipanshu Kale</p>
          </div>

          <p className="mt-8 text-[11px] text-[rgb(var(--muted))]">
            Developed by <span className="font-medium text-[rgb(var(--text))]">Dipanshu Kale</span>
          </p>

          <div className="pointer-events-none absolute -bottom-24 -right-10 h-52 w-52 rounded-full bg-[radial-gradient(circle_at_0%_0%,rgba(126,231,255,0.95),transparent_65%)] opacity-80 blur-3xl" />
        </div>

        <div className="flex w-full flex-col justify-center bg-[rgba(var(--panel2)/0.9)] px-6 py-8 text-left md:w-[48%] md:px-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[rgb(var(--text))] md:text-2xl">
              {title}
            </h2>
            <p className="mt-1 text-xs text-[rgb(var(--muted))]">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, type = "text", ...props }) {
  return (
    <label className="mb-3 block text-xs text-[rgb(var(--muted))]">
      <span className="mb-1 inline-block">{label}</span>
      <div className="relative flex items-center rounded-2xl border border-white/10 bg-[rgba(var(--panel2)/0.9)] px-3 py-2 text-sm text-[rgb(var(--text))] shadow-[0_10px_40px_rgba(0,0,0,0.55)] focus-within:ring-2 focus-within:ring-[rgba(var(--ring)/0.45)]">
        <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/5 text-[rgb(var(--muted))]">
          <Icon className="text-sm" />
        </span>
        <input
          {...props}
          type={type}
          className="h-7 w-full bg-transparent text-xs outline-none placeholder:text-[rgb(var(--muted))]"
        />
      </div>
    </label>
  );
}

function PasswordField({ label, value, onChange, name, placeholder }) {
  const [visible, setVisible] = useState(false);
  const toggle = () => setVisible((v) => !v);
  return (
    <label className="mb-3 block text-xs text-[rgb(var(--muted))]">
      <span className="mb-1 inline-block">{label}</span>
      <div className="relative flex items-center rounded-2xl border border-white/10 bg-[rgba(var(--panel2)/0.9)] px-3 py-2 text-sm text-[rgb(var(--text))] shadow-[0_10px_40px_rgba(0,0,0,0.55)] focus-within:ring-2 focus-within:ring-[rgba(var(--ring)/0.45)]">
        <span className="mr-2 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/5 text-[rgb(var(--muted))]">
          <FiLock className="text-sm" />
        </span>
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-7 w-full bg-transparent text-xs outline-none placeholder:text-[rgb(var(--muted))]"
        />
        <button
          type="button"
          onClick={toggle}
          className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/5 text-[rgb(var(--muted))] hover:bg-white/10 hover:text-[rgb(var(--text))]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
        </button>
      </div>
    </label>
  );
}

function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest(API_ENDPOINTS.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        auth: "none",
        body: JSON.stringify(formData),
      });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your Convo account"
      subtitle="Sign up to start focused, distraction‑free conversations."
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <Field
          label="Username"
          name="username"
          placeholder="Choose a unique username"
          icon={FiUser}
          autoComplete="username"
          required
          onChange={handleChange}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          icon={FiMail}
          autoComplete="email"
          required
          onChange={handleChange}
        />
        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a secure password"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex h-10 items-center justify-center rounded-2xl bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] text-xs font-semibold text-black shadow-[0_18px_45px_rgba(0,0,0,0.7)] transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/60 border-t-transparent" />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>

        <p className="mt-3 text-[11px] text-[rgb(var(--muted))]">
          Already have an account?{" "}
          <button
            type="button"
            className="font-medium text-[rgb(var(--primary))] hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

function Login() {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        auth: "none",
        credentials: "include",
        body: JSON.stringify(formData),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back to Convo"
      subtitle="Sign in to continue your conversations."
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          icon={FiMail}
          autoComplete="email"
          required
          onChange={handleChange}
        />
        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex h-10 items-center justify-center rounded-2xl bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--accent))] text-xs font-semibold text-black shadow-[0_18px_45px_rgba(0,0,0,0.7)] transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-black/60 border-t-transparent" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <p className="mt-3 text-[11px] text-[rgb(var(--muted))]">
          Do not have an account?{" "}
          <button
            type="button"
            className="font-medium text-[rgb(var(--primary))] hover:underline"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

export { Signup, Login };
