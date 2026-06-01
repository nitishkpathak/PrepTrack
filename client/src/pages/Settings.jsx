import { useEffect, useState } from "react";
import { Menu, Lock, Settings as SettingsIcon, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import NavbarProfile from "../components/NavbarProfile";
import { getProfile, updatePreferences, changePassword } from "../services/userService";
import { resetAllQuestions } from "../services/questionService";

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingPrefs, setLoadingPrefs] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

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
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white transition duration-300">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 p-4 md:p-6 md:ml-[260px]">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-950 border-b border-gray-300 dark:border-gray-800 py-5 mb-8 backdrop-blur-md transition duration-300 flex justify-between items-center">
          <div className="flex items-center gap-4">
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
          <NavbarProfile />
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

          {/* Change Password */}
          <div className="bg-gray-200 dark:bg-gray-900 p-6 md:p-8 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-md">
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2 border-b border-gray-300 dark:border-gray-800 pb-3">
              <Lock size={20} className="text-yellow-500" />
              Security Settings
            </h2>
            <form onSubmit={handlePassSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Current Password
                </label>
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
    </div>
  );
}

export default Settings;