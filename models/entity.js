const mongoose = require("mongoose");

const EntitySchema = new mongoose.Schema({
    entityId: { type: String, required: true },
    authors: { type: Array }, // Array of user ids
    title: { type: String },
    description: { type: String },
    imageLink: { type: String }, 
    preferences: { type: mongoose.Schema.Types.Mixed }, // will store XP points etc for the entity
    createdAt: {type: Date, default: Date.now()}
});

const Entity = mongoose.model("Entity", EntitySchema);

module.exports = Entity;
