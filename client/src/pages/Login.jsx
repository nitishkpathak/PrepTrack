import { useState } from "react";

import { loginUser } from "../services/authService";

import { useNavigate, Link, } from "react-router-dom";

function Login() {

  const navigate =
    useNavigate();

    const [formData,
    setFormData] =
      useState({

        email: "",
        password: "",

      });

    const [loading,
      setLoading] =
      useState(false);



  // Handle input
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,

    });

  };

  // Handle submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const data =
        await loginUser(
          formData
        );

      console.log(data);

      // Save token
      localStorage.setItem(
      "token",
      data.token
    );

      const optimizedUser = {

      _id:
        data.user._id,

      name:
        data.user.name,

      email:
        data.user.email,

      role:
        data.user.role,

      bio:
        data.user.bio,

      createdAt:
        data.user.createdAt,

      streak: 
       data.user.streak,

      lastSolvedDate: 
        data.user.lastSolvedDate,

      // REMOVE HUGE IMAGE
      profilePic:
      data.user.profilePic || "",

    };

    localStorage.setItem(

      "user",

      JSON.stringify(
        optimizedUser
      )

    );

      alert(
        "Login Successful 🚀"
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert(
        "Invalid Credentials"
      );

    } finally {

      setLoading(false);

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

          Login to continue 🚀

        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

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

                focus:border-blue-500

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

                focus:border-blue-500

                transition
                duration-300
              "
            />

          </div>

          {/* Button */}
          <button
            type="submit"

            disabled={loading}

            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              p-3
              rounded-lg
              transition
              duration-300
              cursor-pointer
            "
          >

            {
              loading

                ? "Logging in..."

                : "Login"
            }

          </button>          

        </form>



          <div
            className="
              mt-6
              text-center
            "
          >

            <p
              className="
                text-gray-700
                dark:text-gray-400
                mb-3
              "
            >

              Don't have an account?

            </p>

        <Link
          to="/register"
        >

            <button
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

              Register / Sign Up

            </button>

          </Link>

        </div>

      </div>



    </div>
  );
}

export default Login;