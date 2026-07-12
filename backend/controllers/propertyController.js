const Property = require("../models/Property");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");

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


// CREATE PROPERTY
exports.createProperty = async (req, res) => {

  const { title, description, price, location, bachelorAllowed, furnishing } = req.body;

  let imageUrl = "";

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    imageUrl = result.secure_url;
  }

  const property = await Property.create({
    title,
    description,
    price: toNumber(price),
    location,
    bachelorAllowed: toBoolean(bachelorAllowed, true),
    furnishing,
    image: imageUrl,
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

  const { title, description, price, location, bachelorAllowed, furnishing } = req.body;

  let imageUrl;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    imageUrl = result.secure_url;
  }

  property.title = title || property.title;
  property.description = description || property.description;
  property.price = price ? toNumber(price, property.price) : property.price;
  property.location = location || property.location;
  property.bachelorAllowed =
    bachelorAllowed === undefined || bachelorAllowed === null || bachelorAllowed === ""
      ? property.bachelorAllowed
      : toBoolean(bachelorAllowed, property.bachelorAllowed);
  property.furnishing = furnishing || property.furnishing;
  property.image = imageUrl || property.image;

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
