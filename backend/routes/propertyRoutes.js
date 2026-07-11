const express = require("express");
const router = express.Router();

const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  expressInterest,
  getMyProperties,
  saveProperty,
  removeSavedProperty,
  contactLandlord,
  getLandlordContactDetails
} = require("../controllers/propertyController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");


/* =========================
   LANDLORD ROUTES
========================= */

// Create property
router.post(
  "/",
  protect,
  authorizeRoles("landlord"),
  upload.single("image"),
  createProperty
);

// Landlord dashboard
router.get(
  "/my-properties",
  protect,
  authorizeRoles("landlord"),
  getMyProperties
);

// Update property
router.put(
  "/:id",
  protect,
  authorizeRoles("landlord"),
  upload.single("image"),
  updateProperty
);

// Delete property
router.delete(
  "/:id",
  protect,
  authorizeRoles("landlord"),
  deleteProperty
);


/* =========================
   PUBLIC ROUTES
========================= */

// Get all properties
router.get("/", getProperties);

// Get single property
router.get("/:id", getPropertyById);


/* =========================
   TENANT ROUTES
========================= */

// Save property
router.post(
  "/:id/save",
  protect,
  authorizeRoles("tenant"),
  saveProperty
);

// Remove saved property
router.delete(
  "/:id/save",
  protect,
  authorizeRoles("tenant"),
  removeSavedProperty
);

// Express interest
router.post(
  "/:id/interest",
  protect,
  authorizeRoles("tenant"),
  expressInterest
);

// Contact landlord
router.post(
  "/:id/contact",
  protect,
  authorizeRoles("tenant"),
  contactLandlord
);

// Get landlord contact details
router.get(
  "/:id/contact-details",
  protect,
  authorizeRoles("tenant"),
  getLandlordContactDetails
);


module.exports = router;
