const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  googleid: String,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
