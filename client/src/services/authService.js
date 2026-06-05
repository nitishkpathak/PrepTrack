import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL}/api/auth`;

// REGISTER
export const registerUser =
  async (userData) => {

    const response =
      await axios.post(

        `${API}/register`,

        userData

      );

    return response.data;
  };

// LOGIN
export const loginUser =
  async (userData) => {

    const response =
      await axios.post(

        `${API}/login`,

        userData

      );

    return response.data;
  };

// VERIFY OTP
export const verifyOTP =
  async (userData) => {

    const response =
      await axios.post(

        `${API}/verify-otp`,

        userData

      );

    return response.data;
  };

// COMPLETE SIGNUP
export const completeSignup =
  async (userData) => {

    const response =
      await axios.post(

        `${API}/complete-signup`,

        userData

      );

    return response.data;
  };