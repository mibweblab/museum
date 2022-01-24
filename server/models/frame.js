const mongoose = require("mongoose");


const FrameSchema = new mongoose.Schema({
  name: String,
  type: String,
  imageUrl: {
      type: String,
      default: `https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
  },
  text: String,
  frameColor: String,
  position: Array,
  rotation: Array,
  scale: Array,
  userId: String,
  parentId: String,
  imageZoomRatio: Number
});

// compile model from schema
module.exports = mongoose.model("frame", FrameSchema);