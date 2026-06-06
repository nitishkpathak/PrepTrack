import { useEffect, useState } from "react";
import { Menu, User, Camera, Mail, Calendar, Edit2, Briefcase, FileText } from "lucide-react";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import { getProfile, updateProfile } from "../services/userService";
import { getQuestions } from "../services/questionService";
import ContributionCalendar from "../components/ContributionCalendar";

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [solvedCount, setSolvedCount] = useState(0);
  const [questions, setQuestions] = useState([]);

  const savedUserJson = localStorage.getItem("user");
  const initialUser = savedUserJson ? JSON.parse(savedUserJson) : {};

  const [profile, setProfile] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    role: initialUser.role || "",
    bio: initialUser.bio || "",
    profilePic: initialUser.profilePic || "",
    streak: initialUser.streak || 0,
    longestStreak: initialUser.longestStreak || 0,
    joined: initialUser.createdAt
      ? new Date(initialUser.createdAt).toLocaleDateString()
      : "",
  });

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      if (data && data.user) {
        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          role: data.user.role || "",
          bio: data.user.bio || "",
          profilePic: data.user.profilePic || "",
          streak: data.user.streak || 0,
          longestStreak: data.user.longestStreak || 0,
          joined: data.user.createdAt
            ? new Date(data.user.createdAt).toLocaleDateString()
            : "",
        });
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userUpdated"));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to sync profile data ❌");
    }
  };

  const fetchSolvedCount = async () => {
    try {
      const questionsData = await getQuestions();
      setQuestions(questionsData);
      const solved = questionsData.filter((q) => q.status === "Solved").length;
      setSolvedCount(solved);
    } catch (error) {
      console.error("Failed to fetch questions solved count:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchSolvedCount();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Image size must be less than 3MB ❌");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await updateProfile({
        name: profile.name,
        role: profile.role,
        bio: profile.bio,
        profilePic: profile.profilePic,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...data.user,
          profilePic: profile.profilePic,
        })
      );

      setEditing(false);
      toast.success("Profile saved successfully! 🚀");
      window.dispatchEvent(new Event("userUpdated"));
      fetchProfile();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />

      <div className="w-full min-h-screen bg-white dark:bg-black text-black dark:text-white transition duration-300">
        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 md:ml-[260px] min-w-0">
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
              <User size={24} className="text-blue-500" />
              My Profile
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {editing ? (
            /* Editing Card */
            <div className="bg-gray-200 dark:bg-gray-900 p-8 rounded-2xl border border-gray-300 dark:border-gray-800 shadow-lg">
              <h2 className="text-xl font-bold mb-6 border-b border-gray-300 dark:border-gray-800 pb-3">
                Edit Profile Details
              </h2>
              <form onSubmit={handleSave} className="space-y-6">
                {/* Photo Upload */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <img
                      src={profile.profilePic || "/default-profile.png"}
                      alt="Avatar Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full cursor-pointer transition shadow-md">
                      <Camera size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                        hidden
                      />
                    </label>
                  </div>
                  <span className="text-xs text-gray-500">Supported formats: JPG, PNG. Max size 3MB</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      required
                      className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Role / Designation
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={profile.role}
                      onChange={handleChange}
                      placeholder="e.g. Frontend Developer, Student"
                      className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself, your coding journey, or goals..."
                    className="w-full p-3 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm h-32 resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      fetchProfile();
                    }}
                    className="flex-1 py-3 rounded-lg bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 text-black dark:text-white font-semibold text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? "Saving Changes..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Viewing Card & Coding Calendar */
            <div className="space-y-8">
              <div className="bg-gray-200 dark:bg-gray-900 p-8 md:p-10 rounded-2xl border border-gray-300 dark:border-gray-800 text-center shadow-lg transition duration-300">
              <img
                src={profile.profilePic || "/default-profile.png"}
                alt="Profile Avatar"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 mx-auto mb-6 shadow-md"
              />

              <h2 className="text-3xl font-bold mb-2 text-black dark:text-white">
                {profile.name}
              </h2>

              <p className="text-blue-500 text-lg font-semibold mb-6 flex items-center justify-center gap-1.5">
                <Briefcase size={16} />
                {profile.role || "DSA Enthusiast"}
              </p>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8 bg-gray-100 dark:bg-gray-950 p-5 rounded-2xl border border-gray-300 dark:border-gray-800/80 shadow-inner">
                <div className="text-center">
                  <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Solved</span>
                  <span className="block text-2xl md:text-3xl font-extrabold text-green-600 dark:text-green-500 mt-1">{solvedCount}</span>
                </div>
                <div className="text-center border-x border-gray-300 dark:border-gray-800">
                  <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Streak</span>
                  <span className="block text-2xl md:text-3xl font-extrabold text-orange-500 mt-1">🔥 {profile.streak}</span>
                </div>
                <div className="text-center">
                  <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Longest Streak</span>
                  <span className="block text-2xl md:text-3xl font-extrabold text-yellow-600 dark:text-yellow-500 mt-1">🏆 {profile.longestStreak}</span>
                </div>
              </div>

              <div className="max-w-2xl mx-auto space-y-4 text-left text-sm text-gray-700 dark:text-gray-300 border-t border-b border-gray-300 dark:border-gray-800 py-6 my-6">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-blue-500" />
                  <span className="font-semibold text-gray-600 dark:text-gray-400 w-24">Email:</span>
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-blue-500" />
                  <span className="font-semibold text-gray-600 dark:text-gray-400 w-24">Joined:</span>
                  <span>{profile.joined || "N/A"}</span>
                </div>
                {profile.bio && (
                  <div className="flex gap-3 items-start mt-4">
                    <FileText size={16} className="text-blue-500 mt-1" />
                    <div className="flex-1">
                      <span className="font-semibold text-gray-600 dark:text-gray-400 block mb-1">About Me:</span>
                      <p className="bg-white dark:bg-gray-850 p-4 rounded-xl border border-gray-300 dark:border-gray-800/80 leading-relaxed italic text-sm">
                        {profile.bio}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-lg transition shadow-md hover:shadow-lg flex items-center gap-2 mx-auto cursor-pointer"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            </div>

            <ContributionCalendar questions={questions} />
          </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Profile;
