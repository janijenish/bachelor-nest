const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const getAuthResponse = (user, message) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: createToken(user),
    message
  };
};

// REGISTER USER
exports.registerUser = async (req, res) => {

  const { name, email, password, role } = req.body;

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const allowedRoles = ["tenant", "landlord"];
  const safeRole = allowedRoles.includes(role) ? role : "tenant";

  const userExists = await User.findOne({ email: normalizedEmail });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: safeRole
  });

  res.status(201).json(
    getAuthResponse(user, "User registered successfully")
  );

};

// LOGIN USER
exports.loginUser = async (req, res) => {

  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json(
    getAuthResponse(user, "Login successful")
  );

};

// GET PROFILE (Protected)
exports.getProfile = async (req, res) => {

  res.json({
    message: "Access granted to protected route",
    user: req.user
  });

};

// GET SAVED PROPERTIES
exports.getSavedProperties = async (req, res) => {

  const user = await User.findById(req.user._id)
    .populate("savedProperties");

  res.json(user.savedProperties);

};
