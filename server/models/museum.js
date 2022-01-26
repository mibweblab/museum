const mongoose = require("mongoose");
// let id = 1103970;
const MuseumSchema = new mongoose.Schema({
  name: String,
  description: String,
  isPrivate: {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
    default: `https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
  },
  userId: String,
  intensity: {
    default: 1,
    type: Number,
  },
  backgroundColor: {
    default: "#ffffff",
    type: String,
  },
  fogColor: {
    default: "#ffffff",
    type: String,
  },

  planeLength: {
    default: 20,
    type: Number,
  },
  planeWidth: {
    default: 20,
    type: Number,
  },
  planeColor: {
    default: "#ffffff",
    type: String,
  },
  planeStrength: {
    default: 1,
    type: Number,
  },
  textureIndex: {
    default: 0,
    type: Number,
  },
  dateModified: Date
});

// compile model from schema
module.exports = mongoose.model("museum", MuseumSchema);
