const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  bachelorAllowed: {
    type: Boolean,
    default: true
  },

  furnishing: {
    type: String
  },

  images: [
    {
      type: String
    }
  ],

  image: {
    type: String
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  interestedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  contactRequests: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      message: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
},
{ timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
