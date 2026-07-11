const Property = require("../models/Property");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs/promises");

const toBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === "true" || value === "1";
};

const toNumber = (value, fallback = 0) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isNaN(parsed) ? fallback : parsed;
};

const collectUploadedFiles = (req) => {
  const files = [];

  if (req.file) {
    files.push(req.file);
  }

  if (Array.isArray(req.files)) {
    files.push(...req.files);
    return files;
  }

  if (req.files && typeof req.files === "object") {
    Object.values(req.files).forEach((value) => {
      if (Array.isArray(value)) {
        files.push(...value);
        return;
      }

      if (value) {
        files.push(value);
      }
    });
  }

  return files;
};

const uploadFilesToCloudinary = async (files) => {
  const uploadedUrls = [];

  try {
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path);
      uploadedUrls.push(result.secure_url);
    }
  } finally {
    await Promise.all(
      files.map((file) => fs.unlink(file.path).catch(() => {}))
    );
  }

  return uploadedUrls;
};


// CREATE PROPERTY
exports.createProperty = async (req, res) => {

  const { title, description, price, location, furnishing } = req.body;
  const uploadedFiles = collectUploadedFiles(req);
  const imageUrls = uploadedFiles.length ? await uploadFilesToCloudinary(uploadedFiles) : [];

  const property = await Property.create({
    title,
    description,
    price: toNumber(price),
    location,
    bachelorAllowed: true,
    furnishing,
    images: imageUrls,
    image: imageUrls[0] || "",
    postedBy: req.user._id
  });

  res.status(201).json({
    message: "Property listed successfully",
    property
  });
};


// GET ALL PROPERTIES
exports.getProperties = async (req, res) => {

  const {
    search,
    location,
    bachelorAllowed,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    sort
  } = req.query;

  let filter = {};

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  if (location) {
    filter.location = location;
  }

  if (bachelorAllowed) {
    filter.bachelorAllowed = bachelorAllowed === "true";
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  const total = await Property.countDocuments(filter);

  const properties = await Property.find(filter)
    .populate("postedBy", "name email")
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  res.json({
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    properties
  });
};


// GET SINGLE PROPERTY
exports.getPropertyById = async (req, res) => {

  const property = await Property.findById(req.params.id)
    .populate("postedBy", "name email")
    .populate("interestedUsers", "name email")
    .populate("contactRequests.user", "name email");

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  res.json(property);
};


// UPDATE PROPERTY
exports.updateProperty = async (req, res) => {

  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const { title, description, price, location, furnishing } = req.body;
  const uploadedFiles = collectUploadedFiles(req);
  const imageUrls = uploadedFiles.length ? await uploadFilesToCloudinary(uploadedFiles) : [];

  property.title = title || property.title;
  property.description = description || property.description;
  property.price = price ? toNumber(price, property.price) : property.price;
  property.location = location || property.location;
  property.bachelorAllowed = true;
  property.furnishing = furnishing || property.furnishing;
  if (imageUrls.length > 0) {
    property.images = imageUrls;
    property.image = imageUrls[0];
  }

  const updated = await property.save();

  res.json(updated);
};


// DELETE PROPERTY
exports.deleteProperty = async (req, res) => {

  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await property.deleteOne();

  res.json({ message: "Property deleted" });
};


// EXPRESS INTEREST
exports.expressInterest = async (req, res) => {

  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.interestedUsers.includes(req.user._id)) {
    res.status(400);
    throw new Error("Already expressed interest");
  }

  property.interestedUsers.push(req.user._id);

  await property.save();

  res.json({ message: "Interest expressed successfully" });
};


// LANDLORD DASHBOARD
exports.getMyProperties = async (req, res) => {

  const properties = await Property.find({
    postedBy: req.user._id
  })
  .populate("interestedUsers", "name email");

  res.json(properties);
};


// SAVE PROPERTY
exports.saveProperty = async (req, res) => {

  const user = await User.findById(req.user._id);

  const propertyId = req.params.id;

  if (user.savedProperties.includes(propertyId)) {
    res.status(400);
    throw new Error("Property already saved");
  }

  user.savedProperties.push(propertyId);

  await user.save();

  res.json({ message: "Property saved" });
};


// REMOVE SAVED PROPERTY
exports.removeSavedProperty = async (req, res) => {

  const user = await User.findById(req.user._id);

  const propertyId = req.params.id;

  user.savedProperties = user.savedProperties.filter(
    id => id.toString() !== propertyId
  );

  await user.save();

  res.json({ message: "Property removed from saved list" });
};


// CONTACT LANDLORD
exports.contactLandlord = async (req, res) => {

  const { message } = req.body;

  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  property.contactRequests.push({
    user: req.user._id,
    message
  });

  await property.save();

  res.json({ message: "Contact request sent" });
};


// LANDLORD VIEW CONTACT REQUESTS
exports.getContactRequests = async (req, res) => {

  const properties = await Property.find({
    postedBy: req.user._id
  })
  .populate("contactRequests.user", "name email")
  .select("title contactRequests");

  res.json(properties);
};


// TENANT VIEW LANDLORD CONTACT DETAILS
exports.getLandlordContactDetails = async (req, res) => {

  const property = await Property.findById(req.params.id)
    .populate("postedBy", "name email contactNumber whatsappNumber");

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (!property.postedBy) {
    res.status(404);
    throw new Error("Landlord contact details not available");
  }

  res.json({
    propertyId: property._id,
    propertyTitle: property.title,
    landlord: {
      name: property.postedBy.name,
      email: property.postedBy.email,
      contactNumber: property.postedBy.contactNumber || "",
      whatsappNumber: property.postedBy.whatsappNumber || ""
    }
  });

};
