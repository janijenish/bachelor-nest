const cloudinary = require("cloudinary").v2;

console.log("====== CLOUDINARY ENV ======");
console.log("NAME:", process.env.CLOUDINARY_NAME);
console.log("KEY:", process.env.CLOUDINARY_KEY);
console.log("SECRET EXISTS:", !!process.env.CLOUDINARY_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = cloudinary;