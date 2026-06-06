import { useState } from "react";
import { loginUser, forgotPassword, resetPassword } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Forgot password flow states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);



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

      longestStreak:
       data.user.longestStreak || 0,

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
        <Link to="/" className="block text-center mb-2">
          <h1
            className="
              text-4xl
              font-bold

              text-black
              dark:text-white
              hover:text-blue-500
              transition
              duration-300
            "
          >
            PrepTrack
          </h1>
        </Link>

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
            <div className="flex justify-between items-center mb-2">
              <label
                className="
                  block
                  text-gray-700
                  dark:text-gray-400
                "
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(true);
                  setResetStep(1);
                  setResetEmail(formData.email || "");
                  setResetOtp("");
                  setNewPassword("");
                }}
                className="text-xs text-blue-500 hover:underline cursor-pointer font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
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

          <div className="mt-4">
            <Link
              to="/"
              className="
                text-blue-500
                hover:text-blue-600
                hover:underline
                text-sm
                font-medium
                inline-flex
                items-center
                gap-1
              "
            >
              ← Back to Home
            </Link>
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
                    if (!resetEmail) return alert("Please enter email");
                    setResetLoading(true);
                    try {
                      await forgotPassword({ email: resetEmail });
                      alert("Reset OTP sent to your email! 📩");
                      setResetStep(2);
                    } catch (err) {
                      alert(err.response?.data?.message || "Failed to send reset OTP");
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
                    if (!resetOtp) return alert("Please enter OTP code");
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
                      return alert("Password must be at least 6 characters");
                    }
                    setResetLoading(true);
                    try {
                      const res = await resetPassword({
                        email: resetEmail,
                        otp: resetOtp,
                        newPassword: newPassword,
                      });
                      alert(res.message || "Password reset successfully! Please log in.");
                      setShowResetModal(false);
                    } catch (err) {
                      alert(err.response?.data?.message || "Failed to reset password");
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



    </div>
  );
}

export default Login;