import { useState } from "react";
import { loginUser, forgotPassword, resetPassword, googleLogin } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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

  // Custom alert states
  const [alertMessage, setAlertMessage] = useState(null);

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // reCAPTCHA robot check states
  const [isRobotVerified, setIsRobotVerified] = useState(false);
  const [recaptchaLoading, setRecaptchaLoading] = useState(false);

  // Google OAuth selection modal states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState(1); // 1: Account list, 2: Custom input
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [customGoogleName, setCustomGoogleName] = useState("");

  const showAlert = (text, type = "error", onClose = null) => {
    setAlertMessage({ text, type, onClose });
  };

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      showAlert("Please enter email and password", "error");
      return;
    }

    if (!isRobotVerified) {
      showAlert("Please verify that you are not a robot! 🤖", "error");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(formData);
      console.log(data);

      // Save token
      localStorage.setItem("token", data.token);

      const optimizedUser = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        bio: data.user.bio,
        createdAt: data.user.createdAt,
        streak: data.user.streak,
        longestStreak: data.user.longestStreak || 0,
        lastSolvedDate: data.user.lastSolvedDate,
        profilePic: data.user.profilePic || "",
      };

      localStorage.setItem("user", JSON.stringify(optimizedUser));

      showAlert("Login Successful 🚀", "success", () => {
        navigate("/dashboard");
      });

    } catch (error) {
      console.log(error);
      showAlert(
        error.response?.data?.message || "Invalid Credentials",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login Select
  const handleGoogleLoginSubmit = async (email, name) => {
    setLoading(true);
    try {
      const data = await googleLogin({
        email,
        name,
        profilePic: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name || email}`
      });

      // Save token
      localStorage.setItem("token", data.token);

      const optimizedUser = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        bio: data.user.bio,
        createdAt: data.user.createdAt,
        streak: data.user.streak,
        longestStreak: data.user.longestStreak || 0,
        lastSolvedDate: data.user.lastSolvedDate,
        profilePic: data.user.profilePic || "",
      };

      localStorage.setItem("user", JSON.stringify(optimizedUser));

      showAlert("Google Login Successful! 🚀", "success", () => {
        navigate("/dashboard");
      });

    } catch (error) {
      console.error(error);
      showAlert(error.response?.data?.message || "Google Login Failed", "error");
    } finally {
      setLoading(false);
      setShowGoogleModal(false);
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
            mb-6
          "
        >
          Login to continue 🚀
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Enter your email"
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

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="
                  w-full
                  p-3
                  pr-10
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* reCAPTCHA Mock Card */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm select-none">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (recaptchaLoading || isRobotVerified) return;
                  setRecaptchaLoading(true);
                  setTimeout(() => {
                    setRecaptchaLoading(false);
                    setIsRobotVerified(true);
                  }, 900);
                }}
                className={`w-6 h-6 border-2 rounded flex items-center justify-center transition-all cursor-pointer ${
                  isRobotVerified
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-500"
                }`}
              >
                {recaptchaLoading && (
                  <span className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                )}
                {isRobotVerified && (
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                I'm not a robot
              </span>
            </div>
            <div className="flex flex-col items-center justify-center text-[9px] text-gray-400 dark:text-gray-500 leading-none">
              <span className="text-base mb-0.5">🤖</span>
              <span className="font-bold">reCAPTCHA</span>
              <span className="text-[7px] mt-0.5">Privacy • Terms</span>
            </div>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <span className="relative px-3 bg-gray-200 dark:bg-gray-900 text-xs text-gray-500 uppercase tracking-wider">
            Or continue with
          </span>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => {
            setShowGoogleModal(true);
            setGoogleStep(1);
            setCustomGoogleEmail("");
            setCustomGoogleName("");
          }}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg p-3 text-black font-semibold transition duration-300 shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.85-.92 2.11v1.76h1.48c1.37-1.26 2.15-3.12 2.15-5.32z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5H1.27v3.1A11.96 11.96 0 0012 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.24 14.25A7.12 7.12 0 014.8 12c0-.79.13-1.57.38-2.3V6.6H1.27A11.96 11.96 0 000 12c0 2.27.63 4.4 1.27 5.4l3.97-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.27 0 3.22 2.71 1.27 6.6l3.97 3.1c.95-2.87 3.61-5 6.76-5z"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-700 dark:text-gray-400 mb-3 text-sm">
            Don't have an account?
          </p>
          <Link to="/register">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition duration-300 cursor-pointer">
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
                    if (!resetEmail) return showAlert("Please enter email", "error");
                    setResetLoading(true);
                    try {
                      await forgotPassword({ email: resetEmail });
                      showAlert("Reset OTP sent to your email! 📩", "success");
                      setResetStep(2);
                    } catch (err) {
                      showAlert(err.response?.data?.message || "Failed to send reset OTP", "error");
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
                    if (!resetOtp) return showAlert("Please enter OTP code", "error");
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
                      return showAlert("Password must be at least 6 characters", "error");
                    }
                    setResetLoading(true);
                    try {
                      const res = await resetPassword({
                        email: resetEmail,
                        otp: resetOtp,
                        newPassword: newPassword,
                      });
                      showAlert(res.message || "Password reset successfully! Please log in.", "success", () => {
                        setShowResetModal(false);
                      });
                    } catch (err) {
                      showAlert(err.response?.data?.message || "Failed to reset password", "error");
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

      {/* Google Account Selection Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white text-black rounded-2xl p-6 w-full max-w-sm shadow-2xl relative font-sans">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold cursor-pointer"
            >
              &times;
            </button>

            <div className="flex flex-col items-center mb-6">
              <svg className="w-10 h-10 mb-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.85-.92 2.11v1.76h1.48c1.37-1.26 2.15-3.12 2.15-5.32z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.81-2.13-6.76-5H1.27v3.1A11.96 11.96 0 0012 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.24 14.25A7.12 7.12 0 014.8 12c0-.79.13-1.57.38-2.3V6.6H1.27A11.96 11.96 0 000 12c0 2.27.63 4.4 1.27 5.4l3.97-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.22 0 12 0 7.27 0 3.22 2.71 1.27 6.6l3.97 3.1c.95-2.87 3.61-5 6.76-5z"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">
                Sign in with Google
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                to continue to PrepTrack
              </p>
            </div>

            {googleStep === 1 ? (
              <div className="space-y-3">
                {/* Account 1 */}
                <button
                  onClick={() => handleGoogleLoginSubmit("npathak.sp@gmail.com", "Nitish Kumar Pathak")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left transition duration-200 cursor-pointer"
                >
                  <img
                    src="https://api.dicebear.com/7.x/adventurer/svg?seed=Nitish"
                    alt="avatar"
                    className="w-8 h-8 rounded-full bg-blue-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-855">Nitish Kumar Pathak</p>
                    <p className="text-xs text-gray-500">npathak.sp@gmail.com</p>
                  </div>
                </button>

                {/* Account 2 */}
                <button
                  onClick={() => handleGoogleLoginSubmit("guest.preptrack@gmail.com", "Guest Coder")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-left transition duration-200 cursor-pointer"
                >
                  <img
                    src="https://api.dicebear.com/7.x/adventurer/svg?seed=Guest"
                    alt="avatar"
                    className="w-8 h-8 rounded-full bg-green-100"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-855">Guest Coder</p>
                    <p className="text-xs text-gray-500">guest.preptrack@gmail.com</p>
                  </div>
                </button>

                {/* Use another account */}
                <button
                  onClick={() => setGoogleStep(2)}
                  className="w-full flex items-center justify-center p-3 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 text-sm font-medium text-blue-650 transition cursor-pointer"
                >
                  👤 Use another account
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Google Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setGoogleStep(1)}
                    className="flex-1 border border-gray-300 p-2 rounded-lg text-sm font-semibold hover:bg-gray-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (!customGoogleEmail) return showAlert("Please enter your email", "error");
                      handleGoogleLoginSubmit(customGoogleEmail, customGoogleName || customGoogleEmail.split("@")[0]);
                    }}
                    className="flex-1 bg-blue-600 text-white p-2 rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Alert Modal Popup */}
      {alertMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center transform scale-100 transition-all duration-300">
            <div className="text-4xl mb-4">
              {alertMessage.type === "success" ? "🚀" : "❌"}
            </div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              {alertMessage.type === "success" ? "Success" : "Error"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              {alertMessage.text}
            </p>
            <button
              onClick={() => {
                const action = alertMessage.onClose;
                setAlertMessage(null);
                if (action) action();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition cursor-pointer"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;