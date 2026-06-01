import { useEffect, useState } from "react";
import axios from "axios";
import { Menu } from "lucide-react";


import Sidebar from "../components/Sidebar";

import {updateProfile, } from "../services/userService";

function Settings() {



  const savedUserJson = localStorage.getItem("user");
  const initialUser = savedUserJson ? JSON.parse(savedUserJson) : {};

  // Edit Mode
  const [editing,
    setEditing] =
    useState(false);

  // Menu
  const [sidebarOpen,
    setSidebarOpen] =
    useState(false);

  // Profile State
  const [profile,
    setProfile] =
    useState({

      name: initialUser.name || "",
      email: initialUser.email || "",
      role: initialUser.role || "",
      bio: initialUser.bio || "",
      profilePic: initialUser.profilePic || "",
      joined: initialUser.createdAt
        ? new Date(initialUser.createdAt).toLocaleDateString()
        : "",

    });

    // Load Saved Data
    useEffect(() => {

      // PROFILE
      const fetchProfile =
        async () => {

          try {

            const token =
              localStorage.getItem(
                "token"
              );

            // IF NO TOKEN
            if (!token) return;

            // FETCH PROFILE
            const response =
              await axios.get(

                `${import.meta.env.VITE_API_URL}/api/user/profile`,

                {

                  headers: {

                    Authorization:
                      `Bearer ${token}`,

                  },

                }

              );

            const user =
              response.data.user;

            // SAVE USER
            localStorage.setItem(

              "user",

              JSON.stringify(user)

            );

            // SET PROFILE
            setProfile({

              name:
                user.name || "",

              email:
                user.email || "",

              role:
                user.role || "",

              bio:
                user.bio || "",

              joined:
                user.createdAt

                  ? new Date(
                      user.createdAt
                    ).toLocaleDateString()

                  : "",

              profilePic:
                user.profilePic || "",

            });

            setEditing(false);

          } catch (error) {

            console.log(error);

          }
        };

      fetchProfile();

    }, []);

  // Handle Input
  const handleChange = (e) => {

    setProfile({

      ...profile,

      [e.target.name]:
        e.target.value,

    });
  };

  // Handle Image
  const handleImage = (e) => {

    const file =
      e.target.files[0];

      if (
            file.size >
            3 * 1024 * 1024
          ) {

            alert(
              "Image must be less than 1MB"
            );

            return;
          }

    const reader =
      new FileReader();

    reader.onloadend = () => {

      setProfile({

        ...profile,

        profilePic:
        reader.result,

      });
    };

    if (file) {

      reader.readAsDataURL(file);

    }
  };

// Save Profile
const handleSave =
  async () => {

    try {

      const data =
        await updateProfile({

          name:
            profile.name,

          role:
            profile.role,

          bio:
            profile.bio,

          profilePic:
          profile.profilePic,

        });

      localStorage.setItem(

  "user",

  JSON.stringify({

    ...data.user,

    // KEEP IMAGE
    profilePic:
      profile.profilePic,

  })

);

setEditing(false);

alert(
  "Profile Saved Successfully 🚀"
);

  window.dispatchEvent(
    new Event("userUpdated")
  );

    } catch (error) {

      console.log(error);

      alert(
        "Update Failed ❌"
      );
    }
  };

  return (

    <div
      className="
        flex
        min-h-screen

        bg-white
        dark:bg-black

        text-black
        dark:text-white

        transition
        duration-300
      "
    >

      {/* Sidebar */}
      <Sidebar
          open={sidebarOpen}
          closeSidebar={() =>
            setSidebarOpen(false)
          }
        />

      {/* Main */}
      <div
        className="
            flex-1
            p-4
            md:p-6
            md:ml-[260px]
          "
      >

      {/* Sticky Header */}
          <div
            className="
              sticky
              top-0
              z-20

              bg-white
              dark:bg-gray-950

              border-b
              border-gray-300
              dark:border-gray-800

              py-5
              mb-8

              backdrop-blur-md

              transition
              duration-300
            "
          >

      {/* Mobile Menu */}
      <button
        aria-label="Open Sidebar"
        onClick={() =>
          setSidebarOpen(true)
        }

        className="
          md:hidden

          p-2
          mb-4

          bg-blue-600
          text-white

          rounded-lg
          cursor-pointer
        "
      >

        <Menu size={20} />

      </button>

      <h1
        className="
          text-2xl
          md:text-3xl
          font-bold

          text-black
          dark:text-white
        "
      >

        Settings

                </h1>

              </div>

        {/* Profile Section */}
        {

          editing ? (

            <div
              className="
                bg-gray-200
                dark:bg-gray-900

                p-8
                rounded-2xl

                border
                border-gray-300
                dark:border-gray-800

                w-full
                max-w-4xl
                mx-auto
                mb-10

                shadow-lg

                transition
                duration-300
              "
            >

              {/* Profile Image */}
              <div
                className="
                  flex
                  flex-col
                  items-center
                  mb-8
                "
              >

                <img

                  src={
                      profile.profilePic
                        ? profile.profilePic
                        : "/default-profile.png"
                    }

                  alt="Profile"

                  className="
                    w-36
                    h-36
                    rounded-full
                    object-cover
                    border-4
                    border-blue-500
                  "
                />

                <label
                  className="
                    mt-5

                    bg-blue-600
                    hover:bg-blue-700

                    text-white

                    px-5
                    py-2

                    rounded-lg
                    cursor-pointer

                    transition
                    duration-300
                  "
                >

                  Upload Photo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    hidden
                  />

                </label>

              </div>

              {/* Name */}
              <input

                type="text"

                name="name"

                value={profile.name}

                onChange={handleChange}

                placeholder="Full Name"

                className="
                  w-full
                  p-3
                  rounded-lg

                  bg-white
                  dark:bg-gray-800

                  text-black
                  dark:text-white

                  outline-none

                  border
                  border-gray-300
                  dark:border-gray-700

                  mb-4

                  transition
                  duration-300
                "
              />

              {/* Role */}
              <input

                type="text"

                name="role"

                value={profile.role}

                onChange={handleChange}

                placeholder="Role"

                className="
                  w-full
                  p-3
                  rounded-lg

                  bg-white
                  dark:bg-gray-800

                  text-black
                  dark:text-white

                  outline-none

                  border
                  border-gray-300
                  dark:border-gray-700

                  mb-4

                  transition
                  duration-300
                "
              />

              {/* Bio */}
              <textarea

                name="bio"

                value={profile.bio}

                onChange={handleChange}

                placeholder="
                  Write something about yourself
                "

                className="
                  w-full
                  p-3
                  rounded-lg

                  bg-white
                  dark:bg-gray-800

                  text-black
                  dark:text-white

                  outline-none

                  border
                  border-gray-300
                  dark:border-gray-700

                  h-32
                  mb-4

                  transition
                  duration-300
                "
              />

              {/* Save Button */}
              <button

                onClick={handleSave}

                className="
                  bg-blue-600
                  hover:bg-blue-700

                  text-white

                  px-6
                  py-3

                  rounded-lg
                  cursor-pointer

                  transition
                  duration-300
                "
              >

                Save Profile

              </button>

            </div>

          ) : (

            <div
              className="
                bg-gray-200
                dark:bg-gray-900

                p-10
                rounded-2xl

                border
                border-gray-300
                dark:border-gray-800

                w-full
                max-w-4xl
                mx-auto
                mb-10

                text-center

                shadow-lg

                transition
                duration-300
              "
            >

              {/* Profile Image */}
              <img

                src={
                      profile.profilePic
                        ? profile.profilePic
                        : "/default-profile.png"
                    }

                alt="Profile"

                className="
                  w-40
                  h-40
                  rounded-full
                  object-cover
                  border-4
                  border-blue-500
                  mx-auto
                  mb-6
                "
              />

              {/* Name */}
              <h2
                className="
                  text-4xl
                  font-bold
                  mb-3
                "
              >

                {profile.name}

              </h2>

              {/* Email */}
              <p
                className="
                  text-gray-700
                  dark:text-gray-400
                  mb-2
                "
              >

                {profile.email}

              </p>

              {/* Role */}
              <p
                className="
                  text-blue-500
                  text-xl
                  mb-4
                "
              >

                {profile.role}

              </p>

              {/* Joined */}
              <p
                className="
                  text-sm
                  text-gray-500
                  mb-5
                "
              >

                Joined:
                {profile.joined}

              </p>

              {/* Bio */}
              <p
                className="
                  text-gray-700
                  dark:text-gray-400

                  max-w-2xl
                  mx-auto
                  leading-8
                "
              >

                {profile.bio}

              </p>

              {/* Edit Button */}
              <button

                onClick={() =>
                  setEditing(true)
                }

                className="
                  mt-8

                  bg-yellow-600
                  hover:bg-yellow-700

                  text-white

                  px-6
                  py-3

                  rounded-lg
                  cursor-pointer

                  transition
                  duration-300
                "
              >

                Edit Profile

              </button>

            </div>

          )

        }

      </div>

    </div>
  );
}

export default Settings;