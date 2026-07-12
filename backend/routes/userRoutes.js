const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  getSavedProperties
} = require("../controllers/userController");

const { getContactRequests } = require("../controllers/propertyController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");


/* =========================
   AUTH ROUTES
========================= */

router.post("/register", registerUser);
router.post("/login", loginUser);


/* =========================
   USER PROFILE
========================= */

router.get("/profile", protect, getProfile);


/* =========================
   TENANT FEATURES
========================= */

router.get(
  "/saved-properties",
  protect,
  authorizeRoles("tenant"),
  getSavedProperties
);


/* =========================
   LANDLORD FEATURES
========================= */

router.get(
  "/contact-requests",
  protect,
  authorizeRoles("landlord"),
  getContactRequests
);


module.exports = router;
