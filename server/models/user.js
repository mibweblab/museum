const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  googleid: String,
  imageUrl: {
    type: String,
    default: `https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
  },
  description: {
    type:String,
    default: `Museum Curator`,
  },
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
