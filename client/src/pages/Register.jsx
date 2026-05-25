import { useState } from "react";

import { registerUser } from "../services/authService";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // Handle form submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = await registerUser(
        formData
      );

      console.log(data);

      alert("Registration Successful");

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">

      <div className="bg-gray-800 p-8 rounded-xl w-[400px] shadow-lg">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          PrepTrack Register
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-gray-700 text-white outline-none"
          />

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
            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg"
          >
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;