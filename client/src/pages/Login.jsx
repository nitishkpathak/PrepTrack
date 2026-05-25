import { useState } from "react";

import { loginUser } from "../services/authService";

import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    try {

      const data = await loginUser(
        formData
      );

      console.log(data);

      // Save token
      localStorage.setItem(
        "token",
        data.token
      );

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert("Invalid Credentials");

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">

      <div className="bg-gray-800 p-8 rounded-xl w-[400px] shadow-lg">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          PrepTrack Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;