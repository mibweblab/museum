const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  frameId: String,
  description: String,
});

// compile model from schema
module.exports = mongoose.model("conversation", ConversationSchema);