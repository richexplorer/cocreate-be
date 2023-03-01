const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  entityId: { type: String, required: true },
  userId: { type: String, required: true },
  discordId: { type: String },
  addresses: {
    type: Array, // Array of address and chain
    // address: { type: String, required: true },
    // chain: { type: String, required: true },
  },
  emailId: { type: String},
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
