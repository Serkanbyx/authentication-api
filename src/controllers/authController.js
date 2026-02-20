const User = require("../models/User");
const { generateToken } = require("../utils/token");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = User.findByEmail(email || "");
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    const user = await User.create(email, password);
    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const user = User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      data: { user: User.sanitize(user), token },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    data: { user: req.user },
  });
};

module.exports = { register, login, getMe };
