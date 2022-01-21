const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  description: String,
  frameId: String,
  frameUrl: {
    type: String,
    default: `https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`,
},

});

// compile model from schema
module.exports = mongoose.model("conversation", ConversationSchema);