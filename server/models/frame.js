const mongoose = require("mongoose");

let id = 1103970;

const FrameSchema = new mongoose.Schema({
  name: String,
  type: String,
  imageUrl: {
      type: Array,
      default: `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
  },
  text: String,
  frameColor: String,
  position: Array,
  rotation: Array,
});

// compile model from schema
module.exports = mongoose.model("frame", FrameSchema);