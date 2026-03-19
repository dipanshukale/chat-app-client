import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_ENDPOINTS } from "../config/api";
import { apiRequest } from "../services/apiClient";

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
    <div className="flex flex-col justify-center items-center h-screen bg-black">
      <h1 className="text-3xl flex items-center font-bold font-serif mb-16 text-white">
        Welcome To Convo <img src="./chat.jpg" className="w-12 h-12" />
      </h1>
      <form onSubmit={handleSubmit} className="bg-black p-6 rounded-4xl shadow-sm shadow-white w-96">
        <h2 className="text-2xl font-sans mb-4 text-white">Sign Up</h2>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} className="w-full p-3 mb-4 border text-white rounded-3xl" required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 mb-4 border text-white rounded-3xl" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 mb-3 border text-white rounded-3xl" required />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-2xl text-white flex justify-center items-center ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 cursor-pointer"}`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full mr-2"></div>
              Signing Up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
        <p className="text-sm mt-2 text-white">
          Already have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/login")}>
            Log in
          </span>
        </p>
      </form>
    </div>
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
    <div className="flex flex-col justify-center items-center h-screen bg-black">
      <h1 className="text-3xl font-bold font-serif mb-16 text-white flex items-center">
        Welcome To Convo <img src="./chat.jpg" className="h-12 w-12" />
      </h1>
      <form onSubmit={handleSubmit} className="bg-black p-6 rounded-4xl shadow-sm shadow-white w-96">
        <h2 className="text-2xl font-sans mb-4 text-white">Log In</h2>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-3 mb-3 border rounded-2xl text-white" required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-3 mb-3 border rounded-2xl text-white" required />
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded-2xl text-white flex justify-center items-center ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 cursor-pointer"}`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full mr-2"></div>
              Logging In...
            </>
          ) : (
            "Log In"
          )}
        </button>
        <p className="text-sm mt-2 text-white">
          Don't have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/signup")}>
            Signup
          </span>
        </p>
      </form>
    </div>
  );
}

export { Signup, Login };
