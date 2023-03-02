const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    entityId: { type: String, required: true },
    projectId: { type: String, required: true },
    authors: { type: Array }, // Array of user ids

    title: { type: String },
    description: { type: String },
    imageLink: { type: String },
    discordWebhookURL: { type: String },
    discordChannelId: { type: String },
    links: { type: mongoose.Schema.Types.Mixed } ,
    expiresAt: { type: String },
    status: { type: String, enum : [
        'DRAFT', 
        'IN_REVIEW',
        'APPROVED',
        'IN_PROGRESS',
        'COMPLETED',
        'DISCARDED',
    ], default: "DRAFT"},
    createdAt: {type: Date, default: Date.now()}
});

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
