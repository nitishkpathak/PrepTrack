import { useState } from "react";
import axios from "axios";

import { registerUser } from "../services/authService";

import { useNavigate } from "react-router-dom";

function Register() {

  const navigate =
    useNavigate();

  const [formData,
  setFormData] =
    useState({

      name: "",
      email: "",
      password: "",

    });

  // Handle input change
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  // Handle form submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data =
        await registerUser(
          formData
        );

      console.log(data);

      // Save token & user metadata to log in automatically
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // User Profile Data
      const userData = {

        name:
          data.user.name,

        email:
          data.user.email,

        joined:
          new Date(data.user.createdAt)
          .toLocaleDateString(),

        role:
          data.user.role || "DSA Learner",

        bio:
          data.user.bio || "Passionate coder 🚀",

        image: data.user.profilePic || "",

      };

      // Save User Profile
      localStorage.setItem(

        `profile_${data.user.email}`,

        JSON.stringify(userData)

      );

      // Current User
      localStorage.setItem(

        "currentUser",

        data.user.email

      );

      alert(
        "Account Registered Successfully! 🚀"
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message || "Something went wrong"
      );

    }
  };

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center

        bg-white
        dark:bg-black

        px-4

        transition
        duration-300
      "
    >

      <div
        className="
          bg-gray-200
          dark:bg-gray-900

          p-8
          rounded-2xl

          w-full
          max-w-md

          shadow-xl

          border
          border-gray-300
          dark:border-gray-800

          transition
          duration-300
        "
      >

        {/* Heading */}
        <h1
          className="
            text-4xl
            font-bold

            text-black
            dark:text-white

            text-center
            mb-2
          "
        >

          PrepTrack

        </h1>

        <p
          className="
            text-gray-700
            dark:text-gray-400

            text-center
            mb-8
          "
        >

          Create your account 🚀

        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Name */}
          <div>

            <label
              className="
                block

                text-gray-700
                dark:text-gray-400

                mb-2
              "
            >

              Full Name

            </label>

            <input

              type="text"

              name="name"

              placeholder="
                Enter your name
              "

              value={formData.name}

              onChange={handleChange}

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

                focus:border-green-500

                transition
                duration-300
              "
            />

          </div>

          {/* Email */}
          <div>

            <label
              className="
                block

                text-gray-700
                dark:text-gray-400

                mb-2
              "
            >

              Email

            </label>

            <input

              type="email"

              name="email"

              placeholder="
                Enter your email
              "

              value={formData.email}

              onChange={handleChange}

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

                focus:border-green-500

                transition
                duration-300
              "
            />

          </div>

          {/* Password */}
          <div>

            <label
              className="
                block

                text-gray-700
                dark:text-gray-400

                mb-2
              "
            >

              Password

            </label>

            <input

              type="password"

              name="password"

              placeholder="
                Enter your password
              "

              value={formData.password}

              onChange={handleChange}

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

                focus:border-green-500

                transition
                duration-300
              "
            />

          </div>

          {/* Button */}
          <button

            type="submit"

            className="
              w-full

              bg-green-600
              hover:bg-green-700

              text-white

              p-3
              rounded-lg

              transition
              duration-300

              cursor-pointer
            "
          >

            Register

          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;