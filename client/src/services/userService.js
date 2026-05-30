import axios from "axios";

const API =
  "http://localhost:5000/api/user";

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