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