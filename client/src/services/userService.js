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