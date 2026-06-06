import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL}/api/user`;

// UPDATE PROFILE
export const updateProfile =
  async (profileData) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.put(

        `${API}/profile`,

        profileData,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

    return response.data;
  };

// GET PROFILE
export const getProfile =
  async () => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.get(

        `${API}/profile`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

    return response.data;
  };

// UPDATE PREFERENCES
export const updatePreferences =
  async (preferenceData) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.put(

        `${API}/preferences`,

        preferenceData,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

    return response.data;
  };

// CHANGE PASSWORD
export const changePassword =
  async (passwordData) => {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.put(

        `${API}/change-password`,

        passwordData,

        {

          headers: {

            Authorization:
              `Bearer ${token}`,

          },

        }

      );

    return response.data;
  };

// REQUEST EMAIL CHANGE CURRENT
export const requestChangeEmailCurrent = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API}/change-email/request-current`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// VERIFY EMAIL CHANGE CURRENT
export const verifyChangeEmailCurrent = async (otp) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API}/change-email/verify-current`, { otp }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// REQUEST EMAIL CHANGE NEW
export const requestChangeEmailNew = async (newEmail) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API}/change-email/request-new`, { newEmail }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// VERIFY EMAIL CHANGE NEW
export const verifyChangeEmailNew = async (otp) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API}/change-email/verify-new`, { otp }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// REQUEST ACCOUNT DELETION
export const requestDeleteAccount = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API}/delete/request`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// CONFIRM ACCOUNT DELETION
export const confirmDeleteAccount = async (otp, password) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API}/delete/confirm`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { otp, password }
  });
  return response.data;
};