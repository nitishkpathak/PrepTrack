import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { User, X, Camera, Mail, Briefcase, Calendar, Edit2 } from "lucide-react";
import { updateProfile } from "../services/userService";
import toast from "react-hot-toast";

function NavbarProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const savedUserJson = localStorage.getItem("user");
  const initialUser = savedUserJson ? JSON.parse(savedUserJson) : {};

  const [profile, setProfile] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    role: initialUser.role || "",
    bio: initialUser.bio || "",
    profilePic: initialUser.profilePic || "",
    joined: initialUser.createdAt
      ? new Date(initialUser.createdAt).toLocaleDateString()
      : "",
  });

  const loadProfile = () => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const user = JSON.parse(saved);
      setProfile({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        bio: user.bio || "",
        joined: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "",
        profilePic: user.profilePic || "",
      });
    }
  };

  useEffect(() => {
    loadProfile();
    window.addEventListener("userUpdated", loadProfile);

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("userUpdated", loadProfile);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = async () => {
    if (!isOpen) {
      // Fetch fresh profile from backend when opening
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("userUpdated"));
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    }
    setIsOpen(!isOpen);
    setEditing(false);
  };

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
    } catch (error) {
      console.error(error);
      toast.error("Profile update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        aria-label="Toggle profile menu"
        onClick={handleToggle}
        className="flex items-center gap-2 focus:outline-none cursor-pointer"
      >
        <img
          src={profile.profilePic || "/default-profile.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 hover:border-blue-600 transition"
        />
      </button>

      {/* Profile Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-2xl shadow-2xl p-6 z-50 transition duration-300">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-300 dark:border-gray-800">
            <h3 className="font-bold text-lg text-black dark:text-white">
              {editing ? "Edit Profile" : "My Profile"}
            </h3>
            <button
              onClick={() => {
                setIsOpen(false);
                setEditing(false);
              }}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {editing ? (
            /* Editing Layout */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex flex-col items-center gap-2 mb-2">
                <div className="relative">
                  <img
                    src={profile.profilePic || "/default-profile.png"}
                    alt="Edit Profile Pic"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition shadow-md">
                    <Camera size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                      hidden
                    />
                  </label>
                </div>
                <span className="text-xs text-gray-500">Max size 3MB</span>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full p-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={profile.role}
                  onChange={handleChange}
                  placeholder="Role"
                  className="w-full p-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Write something about yourself..."
                  className="w-full p-2 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 outline-none text-sm h-20 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 text-black dark:text-white font-semibold text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          ) : (
            /* Viewing Layout */
            <div className="flex flex-col items-center text-center">
              <img
                src={profile.profilePic || "/default-profile.png"}
                alt="Profile Pic"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 mb-3"
              />
              <h4 className="font-bold text-xl text-black dark:text-white">
                {profile.name || "DSA Learner"}
              </h4>
              <p className="text-xs text-blue-500 font-semibold mb-3">
                {profile.role || "Developer"}
              </p>

              <div className="w-full space-y-3 mt-2 text-left text-sm text-gray-700 dark:text-gray-300 border-t border-gray-300 dark:border-gray-800 pt-3">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span>Joined: {profile.joined || "N/A"}</span>
                </div>
                {profile.bio && (
                  <div className="mt-2 bg-white dark:bg-gray-800/40 p-3 rounded-lg border border-gray-300 dark:border-gray-800/80 italic text-xs leading-5">
                    {profile.bio}
                  </div>
                )}
              </div>

              <button
                onClick={() => setEditing(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition cursor-pointer"
              >
                <Edit2 size={14} />
                Edit Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NavbarProfile;
