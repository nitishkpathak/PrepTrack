import { useEffect, useState } from "react";
import { Menu, Lock, Settings as SettingsIcon, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import { getProfile, updatePreferences, changePassword, requestChangeEmailCurrent, verifyChangeEmailCurrent, requestChangeEmailNew, verifyChangeEmailNew } from "../services/userService";
import { resetAllQuestions } from "../services/questionService";
import { forgotPassword, resetPassword } from "../services/authService";

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingPrefs, setLoadingPrefs] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  // Forgot password flow states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Email change flow states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailStep, setEmailStep] = useState(1); // 1: Request Current, 2: Verify Current, 3: Request New, 4: Verify New
  const [userEmail, setUserEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Practice preferences state
  const [prefs, setPrefs] = useState({
    dailyGoal: 2,
    preferredPlatform: "LeetCode",
  });

  // Password update state
  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load preferences from profile
  const fetchPrefs = async () => {
    try {
      const data = await getProfile();
      if (data && data.user) {
        setPrefs({
          dailyGoal: data.user.dailyGoal ?? 2,
          preferredPlatform: data.user.preferredPlatform || "LeetCode",
        });
        setUserEmail(data.user.email || "");
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  useEffect(() => {
    fetchPrefs();
  }, []);

  const handlePrefChange = (e) => {
    setPrefs({
      ...prefs,
      [e.target.name]: e.target.value,
    });
  };

  const handlePrefSubmit = async (e) => {
    e.preventDefault();
    setLoadingPrefs(true);
    try {
      const res = await updatePreferences(prefs);
      localStorage.setItem("user", JSON.stringify(res.user));
      window.dispatchEvent(new Event("userUpdated"));
      toast.success("Preferences updated successfully! 🚀");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update preferences ❌");
    } finally {
      setLoadingPrefs(false);
    }
  };

  const handlePassChange = (e) => {
    setPassData({
      ...passData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error("New passwords do not match! ❌");
      return;
    }
    if (passData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters ❌");
      return;
    }

    setLoadingPass(true);
    try {
      await changePassword({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      setPassData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully! 🔐");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to change password ❌");
    } finally {
      setLoadingPass(false);
    }
  };

  const handleResetData = async () => {
    const confirm = window.confirm(
      "WARNING: This will permanently delete ALL your questions and reset your daily streak to 0. This action CANNOT be undone. Are you sure you want to proceed?"
    );
    if (!confirm) return;

    setLoadingReset(true);
    try {
      const res = await resetAllQuestions();
      localStorage.setItem("user", JSON.stringify(res.user));
      window.dispatchEvent(new Event("userUpdated"));
      toast.success("All data has been successfully reset! 🧹");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset account questions ❌");
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="w-full min-h-screen overflow-x-hidden bg-white dark:bg-black text-black dark:text-white transition duration-300">
        {/* Main */}
        <div className="flex-1 p-4 md:p-6 md:ml-[260px] min-w-0">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-950 border-b border-gray-300 dark:border-gray-800 py-5 mb-8 backdrop-blur-md transition duration-300 flex items-center gap-4">
          <button
            aria-label="Open Sidebar"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 bg-blue-600 text-white rounded-lg cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white flex items-center gap-2">
            <SettingsIcon size={24} className="text-blue-500" />
            Settings
          </h1>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Practice Preferences */}
          <div className="bg-gray-200 dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-md">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 border-b border-gray-300 dark:border-gray-800 pb-3">
              🎯 Study Preferences
            </h2>
            <form onSubmit={handlePrefSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Daily Question Goal
                </label>
                <select
                  name="dailyGoal"
                  value={prefs.dailyGoal}
                  onChange={handlePrefChange}
                  className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none cursor-pointer"
                >
                  <option value={1}>1 Question / day</option>
                  <option value={2}>2 Questions / day</option>
                  <option value={3}>3 Questions / day</option>
                  <option value={5}>5 Questions / day</option>
                  <option value={10}>10 Questions / day</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Preferred Platform
                </label>
                <select
                  name="preferredPlatform"
                  value={prefs.preferredPlatform}
                  onChange={handlePrefChange}
                  className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none cursor-pointer"
                >
                  <option value="LeetCode">LeetCode</option>
                  <option value="GeeksforGeeks">GeeksforGeeks</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="DSA">General DSA / Other</option>
                </select>
              </div>

              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  disabled={loadingPrefs}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {loadingPrefs ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </form>
          </div>

          {/* Email Settings */}
          <div className="bg-gray-200 dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-md">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 border-b border-gray-300 dark:border-gray-800 pb-3">
              📧 Email Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Current Email Address
                </label>
                <input
                  type="email"
                  value={userEmail}
                  disabled
                  className="w-full p-3 rounded-lg bg-white dark:bg-gray-850 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-750 outline-none text-sm cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailModal(true);
                    setEmailStep(1);
                    setNewEmail("");
                    setEmailOtp("");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition cursor-pointer"
                >
                  Change Email Address
                </button>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-gray-200 dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-md">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 border-b border-gray-300 dark:border-gray-800 pb-3">
              <Lock size={20} className="text-yellow-500" />
              Security Settings
            </h2>
            <form onSubmit={handlePassSubmit} className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
                      setShowResetModal(true);
                      setResetStep(1);
                      setResetEmail(savedUser.email || "");
                      setResetOtp("");
                      setNewPassword("");
                    }}
                    className="text-xs text-blue-500 hover:underline cursor-pointer font-medium"
                  >
                    Forgot Current Password? Reset via OTP
                  </button>
                </div>
                <input
                  type="password"
                  name="currentPassword"
                  value={passData.currentPassword}
                  onChange={handlePassChange}
                  placeholder="Enter current password"
                  required
                  className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passData.newPassword}
                    onChange={handlePassChange}
                    placeholder="Min 6 characters"
                    required
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passData.confirmPassword}
                    onChange={handlePassChange}
                    placeholder="Repeat new password"
                    required
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loadingPass}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {loadingPass ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50/10 dark:bg-red-950/10 p-6 md:p-8 rounded-2xl border border-red-500/30 dark:border-red-500/20 shadow-md">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-500 mb-4 flex items-center gap-2 border-b border-red-500/20 pb-3">
              <AlertTriangle size={20} />
              Danger Zone
            </h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg text-black dark:text-white">
                  Reset Questions and Streaks
                </h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                  This will permanently delete all your questions, difficulty data, analytics, and reset your daily practice streak to zero. This operation is permanent.
                </p>
              </div>
              <button
                onClick={handleResetData}
                disabled={loadingReset}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-lg transition disabled:opacity-50 self-start md:self-center cursor-pointer whitespace-nowrap"
              >
                {loadingReset ? "Resetting..." : "Reset All Data"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-2 text-black dark:text-white text-center">
              Reset Password 🔐
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-6">
              {resetStep === 1 && "Step 1: Enter your registered email"}
              {resetStep === 2 && "Step 2: Enter the 6-digit OTP code"}
              {resetStep === 3 && "Step 3: Setup your new password"}
            </p>

            {resetStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm"
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!resetEmail) return toast.error("Please enter email ❌");
                    setResetLoading(true);
                    try {
                      await forgotPassword({ email: resetEmail });
                      toast.success("Reset OTP sent to your email! 📩");
                      setResetStep(2);
                    } catch (err) {
                      toast.error(err.response?.data?.message || "Failed to send reset OTP ❌");
                    } finally {
                      setResetLoading(false);
                    }
                  }}
                  disabled={resetLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {resetLoading ? "Sending OTP..." : "Send Reset OTP"}
                </button>
              </div>
            )}

            {resetStep === 2 && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      6-Digit OTP Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setResetStep(1)}
                      className="text-xs text-blue-500 hover:underline cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="000000"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white text-center tracking-widest text-xl font-bold border border-gray-300 dark:border-gray-700 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    OTP sent to <span className="font-semibold">{resetEmail}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!resetOtp) return toast.error("Please enter OTP code ❌");
                    setResetStep(3);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg cursor-pointer"
                >
                  Verify & Next
                </button>
              </div>
            )}

            {resetStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm"
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!newPassword || newPassword.length < 6) {
                      return toast.error("Password must be at least 6 characters ❌");
                    }
                    setResetLoading(true);
                    try {
                      const res = await resetPassword({
                        email: resetEmail,
                        otp: resetOtp,
                        newPassword: newPassword,
                      });
                      toast.success(res.message || "Password reset successfully! 🔐");
                      setShowResetModal(false);
                    } catch (err) {
                      toast.error(err.response?.data?.message || "Failed to reset password ❌");
                    } finally {
                      setResetLoading(false);
                    }
                  }}
                  disabled={resetLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {resetLoading ? "Updating..." : "Reset Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Change Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-2 text-black dark:text-white text-center">
              Change Email Address 📧
            </h2>
            
            {/* Step Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-[10px] uppercase font-bold tracking-wider text-gray-500">
              <span className={`px-2 py-0.5 rounded ${emailStep === 1 ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-850"}`}>1. Req Current</span>
              <span className="text-gray-400">→</span>
              <span className={`px-2 py-0.5 rounded ${emailStep === 2 ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-850"}`}>2. Verify Current</span>
              <span className="text-gray-400">→</span>
              <span className={`px-2 py-0.5 rounded ${emailStep === 3 ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-850"}`}>3. Req New</span>
              <span className="text-gray-400">→</span>
              <span className={`px-2 py-0.5 rounded ${emailStep === 4 ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-850"}`}>4. Verify New</span>
            </div>

            {/* Step 1: Request OTP on current email */}
            {emailStep === 1 && (
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-650 dark:text-gray-400">
                  To verify your identity, a verification OTP code will be sent to your registered email <span className="font-semibold text-black dark:text-white">{userEmail}</span>.
                </p>
                <button
                  onClick={async () => {
                    setEmailLoading(true);
                    try {
                      const res = await requestChangeEmailCurrent();
                      toast.success(res.message || "OTP sent successfully! 📩");
                      setEmailStep(2);
                      setEmailOtp("");
                    } catch (err) {
                      toast.error(err.response?.data?.message || "Failed to send OTP to current email ❌");
                    } finally {
                      setEmailLoading(false);
                    }
                  }}
                  disabled={emailLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {emailLoading ? "Sending OTP..." : "Send OTP to Current Email"}
                </button>
              </div>
            )}

            {/* Step 2: Verify OTP for current email */}
            {emailStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="000000"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white text-center tracking-widest text-xl font-bold border border-gray-300 dark:border-gray-700 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    OTP sent to <span className="font-semibold">{userEmail}</span>
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (!emailOtp || emailOtp.length !== 6) {
                      return toast.error("Please enter a valid 6-digit OTP code ❌");
                    }
                    setEmailLoading(true);
                    try {
                      const res = await verifyChangeEmailCurrent(emailOtp);
                      toast.success(res.message || "Current email verified! 🚀");
                      setEmailStep(3);
                      setNewEmail("");
                    } catch (err) {
                      toast.error(err.response?.data?.message || "Verification failed ❌");
                    } finally {
                      setEmailLoading(false);
                    }
                  }}
                  disabled={emailLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {emailLoading ? "Verifying..." : "Verify OTP & Continue"}
                </button>
              </div>
            )}

            {/* Step 3: Enter new email and send OTP */}
            {emailStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm"
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!newEmail) return toast.error("Please enter new email address ❌");
                    setEmailLoading(true);
                    try {
                      const res = await requestChangeEmailNew(newEmail);
                      toast.success(res.message || "OTP sent to new email! 📩");
                      setEmailStep(4);
                      setEmailOtp("");
                    } catch (err) {
                      toast.error(err.response?.data?.message || "Failed to register new email ❌");
                    } finally {
                      setEmailLoading(false);
                    }
                  }}
                  disabled={emailLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {emailLoading ? "Sending OTP..." : "Send OTP to New Email"}
                </button>
              </div>
            )}

            {/* Step 4: Verify OTP for new email */}
            {emailStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="000000"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white text-center tracking-widest text-xl font-bold border border-gray-300 dark:border-gray-700 outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    OTP sent to <span className="font-semibold">{newEmail}</span>
                  </p>
                </div>
                <button
                  onClick={async () => {
                    if (!emailOtp || emailOtp.length !== 6) {
                      return toast.error("Please enter a valid 6-digit OTP code ❌");
                    }
                    setEmailLoading(true);
                    try {
                      const res = await verifyChangeEmailNew(emailOtp);
                      toast.success(res.message || "Email address updated successfully! 🎉");
                      
                      // Update local states & storage
                      setUserEmail(res.user.email);
                      localStorage.setItem("user", JSON.stringify(res.user));
                      window.dispatchEvent(new Event("userUpdated"));
                      
                      setShowEmailModal(false);
                    } catch (err) {
                      toast.error(err.response?.data?.message || "Verification failed ❌");
                    } finally {
                      setEmailLoading(false);
                    }
                  }}
                  disabled={emailLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {emailLoading ? "Updating Email..." : "Verify & Complete Update"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Settings;