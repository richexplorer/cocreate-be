const mongoose = require("mongoose");

const ProposalSchema = new mongoose.Schema({
    entityId: { type: String, required: true },
    projectId: { type: String, required: true },
    proposalId: { type: String, required: true },
    authors: { type: Array }, // Array of user ids

    title: { type: String },
    description: { type: String },
    imageLink: { type: String }, 
    expiresAt: { type: String },
    status: { type: String, enum : [
        'DRAFT', 
        'IN_REVIEW',
        'APPROVED',
        'IN_PROGRESS',
        'COMPLETED',
        'DISCARDED',
    ], default: 'DRAFT'},
    values : { type: Array, default: ["Yes", "No"] },
    createdAt: {type: Date, default: Date.now()}
});

const Proposal = mongoose.model("Proposal", ProposalSchema);

module.exports = Proposal;
