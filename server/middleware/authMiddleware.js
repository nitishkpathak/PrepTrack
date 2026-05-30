const jwt = require("jsonwebtoken");

const User = require("../models/User");

const protect = async (req, res, next) => {

  let token;

  // Check Token
  if (

    req.headers.authorization &&

    req.headers.authorization.startsWith(
      "Bearer"
    )

  ) {

    try {

      // Get Token
      token =
        req.headers.authorization.split(
          " "
        )[1];

      // Verify Token
      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET

        );

      // Get User
      req.user =
        await User.findById(
          decoded.id
        ).select("-password");

      // Continue
      next();

    } catch (error) {

      console.log(error);

      return res.status(401).json({

        message:
          "Not authorized, token failed",

      });
    }
  }

  // No Token
  if (!token) {

    return res.status(401).json({

      message:
        "No token, authorization denied",

    });
  }
};

module.exports = protect;