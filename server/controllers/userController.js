const User =
  require("../models/User");
const bcrypt =
  require("bcryptjs");

// ============================
// GET PROFILE
// ============================

const getProfile =
  async (req, res) => {

    try {

      // Find User
      const user =
        await User.findById(
          req.user.id
        ).select("-password");

      // Check User
      if (!user) {

        return res
          .status(404)
          .json({

            message:
              "User not found",

          });
      }

      // Response
      res.status(200).json({

        user: {

          _id:
            user._id,

          name:
            user.name,

          email:
            user.email,

          role:
            user.role,

          bio:
            user.bio,

          profilePic:
            user.profilePic || "",

          createdAt:
            user.createdAt,

         streak: 
            user.streak,
            
          lastSolvedDate: 
            user.lastSolvedDate,

          dailyGoal:
            user.dailyGoal,

          preferredPlatform:
            user.preferredPlatform,

        },

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",

      });
    }

    
  };

// ============================
// UPDATE PROFILE
// ============================

const updateProfile =
  async (req, res) => {

    try {

      const {

        name,
        role,
        bio,
        profilePic,

      } = req.body;

      // Find User
      const user =
        await User.findById(
          req.user.id
        );

      // Check User
      if (!user) {

        return res
          .status(404)
          .json({

            message:
              "User not found",

          });
      }

      // Update Fields
      user.name =
        name || user.name;

      user.role =
        role || user.role;

      user.bio =
        bio || user.bio;

      user.profilePic =
        profilePic ||
        user.profilePic;

      // Save User
      await user.save();

      // Response
    res.status(200).json({

      message:
        "Profile Updated Successfully",

      user: {

        _id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        bio:
          user.bio,

        profilePic:
          user.profilePic || "",

        createdAt:
          user.createdAt,

        streak:
          user.streak,

        lastSolvedDate:
          user.lastSolvedDate,

      },

    });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",

      });
    }
  };

// ============================
// UPDATE PREFERENCES
// ============================
const updatePreferences = async (req, res) => {
  try {
    const { dailyGoal, preferredPlatform } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.dailyGoal = dailyGoal !== undefined ? dailyGoal : user.dailyGoal;
    user.preferredPlatform = preferredPlatform || user.preferredPlatform;

    await user.save();

    res.status(200).json({
      message: "Preferences updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePic: user.profilePic || "",
        createdAt: user.createdAt,
        streak: user.streak,
        lastSolvedDate: user.lastSolvedDate,
        dailyGoal: user.dailyGoal,
        preferredPlatform: user.preferredPlatform,
      }
    });
  } catch (error) {
    console.error("Update preferences failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// CHANGE PASSWORD
// ============================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    // Hash & save new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully 🚀" });
  } catch (error) {
    console.error("Change password failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ============================
// EXPORTS
// ============================

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
};