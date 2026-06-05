import { useState } from "react";
import { registerUser, verifyOTP, completeSignup } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Details

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    setLoading(true);
    try {
      await registerUser({ email: formData.email });
      alert("OTP sent successfully again! 📩");
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message || "Something went wrong while resending OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (step === 1) {
        if (!formData.email) {
          alert("Please enter your email");
          setLoading(false);
          return;
        }
        await registerUser({ email: formData.email });
        alert("OTP sent successfully to your email! 📩");
        setStep(2);
      } else if (step === 2) {
        if (!formData.otp) {
          alert("Please enter the OTP code");
          setLoading(false);
          return;
        }
        await verifyOTP({ email: formData.email, otp: formData.otp });
        alert("Email verified successfully! 🎉");
        setStep(3);
      } else if (step === 3) {
        if (!formData.name || !formData.password) {
          alert("Please fill in all fields");
          setLoading(false);
          return;
        }
        const data = await completeSignup({
          email: formData.email,
          name: formData.name,
          password: formData.password,
        });

        console.log(data);

        // Save token & user metadata to log in automatically
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // User Profile Data
        const userData = {
          name: data.user.name,
          email: data.user.email,
          joined: new Date(data.user.createdAt).toLocaleDateString(),
          role: data.user.role || "DSA Learner",
          bio: data.user.bio || "Passionate coder 🚀",
          image: data.user.profilePic || "",
        };

        // Save User Profile
        localStorage.setItem(
          `profile_${data.user.email}`,
          JSON.stringify(userData)
        );

        // Current User
        localStorage.setItem("currentUser", data.user.email);

        alert("Account Setup Completed! Welcome to PrepTrack 🚀");
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message || "Something went wrong"
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
          {step === 1 && "Step 1: Verify your email 📩"}
          {step === 2 && "Step 2: Enter the 6-digit OTP code 🔐"}
          {step === 3 && "Step 3: Setup your name & password 🚀"}
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {step === 1 && (
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
                  focus:border-green-500
                  transition
                  duration-300
                "
                required
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  className="
                    block
                    text-gray-700
                    dark:text-gray-400
                  "
                >
                  Enter 6-digit OTP code
                </label>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-blue-500 hover:underline cursor-pointer"
                >
                  Change Email
                </button>
              </div>
              <input
                type="text"
                name="otp"
                maxLength="6"
                placeholder="000000"
                value={formData.otp}
                onChange={handleChange}
                className="
                  w-full
                  p-3
                  rounded-lg
                  bg-white
                  dark:bg-gray-800
                  text-black
                  dark:text-white
                  text-center
                  tracking-widest
                  text-2xl
                  font-bold
                  outline-none
                  border
                  border-gray-300
                  dark:border-gray-700
                  focus:border-green-500
                  transition
                  duration-300
                "
                required
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                OTP sent to <span className="font-semibold text-gray-750 dark:text-gray-350">{formData.email}</span>
              </p>
              
              <div className="flex justify-center mt-3">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-green-600 hover:text-green-700 font-semibold hover:underline disabled:opacity-50 cursor-pointer"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <>
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
                  placeholder="Enter your name"
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
                  required
                />
              </div>

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
                    focus:border-green-500
                    transition
                    duration-300
                  "
                  required
                />
              </div>
            </>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full
              bg-green-600
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700 cursor-pointer"}
              text-white
              p-3
              rounded-lg
              transition
              duration-300
            `}
          >
            {loading ? "Please wait..." : step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Complete Signup"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700 dark:text-gray-400 mb-3 text-sm">
            Already have an account?
          </p>
          <Link to="/login">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition duration-300 cursor-pointer">
              Login
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

    </div>
  );
}

export default Register;