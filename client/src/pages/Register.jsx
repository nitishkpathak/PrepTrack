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

    // User OTP Verification
    const [showOTPModal,
      setShowOTPModal] =
      useState(false);

      const [otp,
      setOtp] =
      useState("");

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

      // User Profile Data
      const userData = {

        name:
          formData.name,

        email:
          formData.email,

        joined:
          new Date()
          .toLocaleDateString(),

        role:
          "DSA Learner",

        bio:
          "Passionate coder 🚀",

        image: "",

      };

      // Save User Profile
      localStorage.setItem(

        `profile_${formData.email}`,

        JSON.stringify(userData)

      );

      // Current User
      localStorage.setItem(

        "currentUser",

        formData.email

      );

      alert(
        "OTP sent to your email 🚀"
      );

      setShowOTPModal(true);

    } catch (error) {
      console.log(error.response?.data);
      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  // ============================
// VERIFY EMAIL OTP
// ============================

const handleVerifyOTP =
  async () => {

    try {

      const response =
        await axios.post(

          `${import.meta.env.VITE_API_URL}/api/auth/verify-email`,

          {

            email:
              formData.email,

            otp,

          }

        );

      alert(
        response.data.message
      );

      setShowOTPModal(false);

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert(
        error.response.data.message
      );
    }
  };

  // ============================
// RESEND OTP
// ============================

const handleResendOTP =
  async () => {

    try {

      const response =
        await axios.post(

          `${import.meta.env.VITE_API_URL}/api/auth/resend-otp`,

          {

            email:
              formData.email,

          }

        );

      alert(
        response.data.message
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response.data.message
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

      {/* OTP */}
      {
    showOTPModal && (

      <div
        className="
          fixed
          inset-0

          bg-black/50

          flex
          items-center
          justify-center

          z-50
        "
      >

        <div
          className="
            bg-white
            dark:bg-gray-900

            p-6
            rounded-2xl

            w-full
            max-w-md

            mx-4
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-5

              text-black
              dark:text-white
            "
          >

            Verify Your Email

          </h2>

          <input

            type="text"

            placeholder="Enter OTP"

            value={otp}

            onChange={(e) =>
              setOtp(
                e.target.value
              )
            }

            className="
              w-full
              p-3
              rounded-lg

              bg-gray-100
              dark:bg-gray-800

              text-black
              dark:text-white

              outline-none
              mb-4
            "
          />

          <button

            onClick={
              handleVerifyOTP
            }

            className="
              w-full

              bg-green-600
              hover:bg-green-700

              text-white

              p-3
              rounded-lg
            "
          >

            Verify OTP

          </button>

          <button

            onClick={
                        handleResendOTP
                      }

                      className="
                        mt-4

                        text-blue-500
                        hover:underline

                        cursor-pointer
                      "
          >

            Resend OTP

          </button>

        </div>

      </div>
    )
  }

    </div>
  );
}

export default Register;