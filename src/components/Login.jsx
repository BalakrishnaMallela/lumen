"use client";

import { useState } from "react";
import { Mail, X, Eye, EyeOff, User, Fingerprint } from "lucide-react";
import axios from 'axios';

// API base URL for a hypothetical backend.
// In a real application, this would be configured for your environment.
const API_BASE_URL = 'http://localhost:5000/api/auth';

// Simple placeholder components for demonstration purposes.
const Dashboard = ({ onLogout }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 text-white">
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-500">
        Welcome, User!
      </h1>
      <p className="text-lg text-gray-400 mb-8">
        This is your personalized dashboard. You're logged in as a standard user.
      </p>
      <button
        onClick={onLogout}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-bold transition-colors"
      >
        Logout
      </button>
    </div>
  </div>
);

const AdminPage = ({ onLogout }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-950 text-white">
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
        Admin Panel
      </h1>
      <p className="text-lg text-gray-400 mb-8">
        You have administrator access. Welcome to the restricted area.
      </p>
      <button
        onClick={onLogout}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-bold transition-colors"
      >
        Logout
      </button>
    </div>
  </div>
);

// The main Login Page component.
const LoginPage = ({ onLoginSuccess, onBack }) => {
  const [activeTab, setActiveTab] = useState("signin"); // Default to signin
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};

    if (activeTab === "signup") {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const endpoint = activeTab === "signup" ? `${API_BASE_URL}/signup` : `${API_BASE_URL}/signin`;
      
      const dataToSend = activeTab === "signup"
        ? formData
        : { email: formData.email, password: formData.password };

      const response = await axios.post(endpoint, dataToSend, {
        withCredentials: true
      });

      if (response.status === 200 || response.status === 201) {
        const userRole = response.data.role;
        console.log("Authentication successful!", response.data);
        onLoginSuccess(userRole);
      }
    } catch (err) {
      console.error("API call failed:", err.response ? err.response.data : err.message);
      setFormError(
        err.response?.data?.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setFormError(null);
    setIsLoading(true);

    try {
      console.log(`Simulating social login with ${provider}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockResponse = {
        data: {
          message: `${provider} login successful`,
          role: provider === "google" ? "user" : "admin"
        }
      };

      console.log("Mock social login successful!", mockResponse.data);
      const userRole = mockResponse.data.role;
      onLoginSuccess(userRole);
    } catch (err) {
      console.error("Social login failed:", err);
      setFormError(`Social login with ${provider} failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15) 0%, transparent 70%),
              radial-gradient(ellipse at bottom right, rgba(59, 130, 246, 0.15) 0%, transparent 70%),
              radial-gradient(ellipse at bottom left, rgba(168, 85, 247, 0.1) 0%, transparent 70%),
              radial-gradient(ellipse at center, rgba(236, 72, 153, 0.1) 0%, transparent 70%),
              linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)
            `,
          }}
        />

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-15 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Login Modal */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="backdrop-blur-3xl bg-black/20 border border-white/20 rounded-3xl p-8 shadow-2xl"
          style={{
            background: `
              linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%),
              rgba(0,0,0,0.2)
            `,
            backdropFilter: "blur(20px)",
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.4), 
              0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
          }}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
            onClick={onBack}
          >
            <X size={16} className="text-white/80" />
          </button>

          {/* Tab Navigation */}
          <div className="flex mb-8">
            <div className="flex bg-black/20 backdrop-blur-xl rounded-full p-1 w-full border border-white/10">
              <button
                className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeTab === "signup"
                    ? "bg-white/10 text-white shadow-lg backdrop-blur-xl"
                    : "text-white/60 hover:text-white/80"
                }`}
                onClick={() => setActiveTab("signup")}
              >
                Sign up
              </button>
              <button
                className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeTab === "signin"
                    ? "bg-white/10 text-white shadow-lg backdrop-blur-xl"
                    : "text-white/60 hover:text-white/80"
                }`}
                onClick={() => setActiveTab("signin")}
              >
                Sign in
              </button>
            </div>
          </div>

          {/* Form Title */}
          <h1 className="text-2xl font-bold text-white mb-8 text-center">
            {activeTab === "signup" ? "Create an account" : "Welcome back"}
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display form-wide errors */}
            {formError && (
              <p className="text-red-400 text-sm font-semibold text-center mt-2">
                {formError}
              </p>
            )}

            {/* Name Fields (Sign up only) */}
            {activeTab === "signup" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-black/20 backdrop-blur-xl border ${
                      errors.firstName ? "border-red-400/50" : "border-white/20"
                    } rounded-xl text-white placeholder-white/50 font-medium focus:outline-none focus:border-white/40 focus:bg-black/30 transition-all duration-200`}
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs font-semibold mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-black/20 backdrop-blur-xl border ${
                      errors.lastName ? "border-red-400/50" : "border-white/20"
                    } rounded-xl text-white placeholder-white/50 font-medium focus:outline-none focus:border-white/40 focus:bg-black/30 transition-all duration-200`}
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs font-semibold mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 bg-black/20 backdrop-blur-xl border ${
                    errors.email ? "border-red-400/50" : "border-white/20"
                  } rounded-xl text-white placeholder-white/50 font-medium focus:outline-none focus:border-white/40 focus:bg-black/30 transition-all duration-200`}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs font-semibold mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field (Sign up only) */}
            {activeTab === "signup" && (
              <div>
                <div className="flex">
                  <div className="flex items-center px-4 py-3 bg-black/20 backdrop-blur-xl border border-white/20 border-r-0 rounded-l-xl">
                    <span className="text-lg mr-2">🇺🇸</span>
                    <svg
                      className="w-3 h-3 text-white/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    placeholder="(775) 351-6501"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`flex-1 px-4 py-3 bg-black/20 backdrop-blur-xl border ${
                      errors.phone ? "border-red-400/50" : "border-white/20"
                    } border-l-0 rounded-r-xl text-white placeholder-white/50 font-medium focus:outline-none focus:border-white/40 focus:bg-black/30 transition-all duration-200`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs font-semibold mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full px-4 pr-12 py-3 bg-black/20 backdrop-blur-xl border ${
                    errors.password ? "border-red-400/50" : "border-white/20"
                  } rounded-xl text-white placeholder-white/50 font-medium focus:outline-none focus:border-white/40 focus:bg-black/30 transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs font-semibold mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-white/90 hover:bg-white text-black font-bold rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                  <span>Please wait...</span>
                </div>
              ) : activeTab === "signup" ? (
                "Create an account"
              ) : (
                "Sign in"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center space-x-4 my-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-white/50 text-xs font-bold">
                OR SIGN IN WITH
              </span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
                className="flex items-center justify-center py-3 bg-black/20 backdrop-blur-xl hover:bg-black/30 border border-white/20 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34a853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fbbc05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("apple")}
                disabled={isLoading}
                className="flex items-center justify-center py-3 bg-black/20 backdrop-blur-xl hover:bg-black/30 border border-white/20 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              </button>
            </div>

            {/* Terms */}
            <p className="text-center text-white/50 text-xs font-semibold mt-6">
              By creating an account, you agree to our{" "}
              <button className="text-white/70 hover:text-white underline">
                Terms & Service
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

// Initial Page with login options.
const InitialPage = ({ onSelectLogin }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-950 text-white">
    <div className="text-center mb-10">
      <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-green-500">
        Choose your login type
      </h1>
      <p className="text-lg text-gray-400">
        Please select the type of account you wish to sign in with.
      </p>
    </div>
    <div className="flex space-x-6">
      <button
        onClick={() => onSelectLogin("user")}
        className="flex flex-col items-center px-8 py-6 rounded-3xl backdrop-blur-3xl bg-black/20 border border-white/20 hover:bg-white/10 transition-colors"
      >
        <User size={48} className="text-white mb-2" />
        <span className="text-xl font-bold">User Login</span>
      </button>
      <button
        onClick={() => onSelectLogin("admin")}
        className="flex flex-col items-center px-8 py-6 rounded-3xl backdrop-blur-3xl bg-black/20 border border-white/20 hover:bg-white/10 transition-colors"
      >
        <Fingerprint size={48} className="text-white mb-2" />
        <span className="text-xl font-bold">Admin Login</span>
      </button>
    </div>
  </div>
);

// Main App Component with conditional rendering
export default function App() {
  const [currentView, setCurrentView] = useState("initial");
  const [userRole, setUserRole] = useState(null);

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    if (role === "admin") {
      setCurrentView("admin");
    } else {
      setCurrentView("dashboard");
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView("initial");
  };

  const handleBack = () => {
    setCurrentView("initial");
  }

  if (currentView === "dashboard") {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (currentView === "admin") {
    return <AdminPage onLogout={handleLogout} />;
  }

  if (currentView === "login") {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={handleBack} />;
  }
  
  return <InitialPage onSelectLogin={() => setCurrentView("login")} />;
}

