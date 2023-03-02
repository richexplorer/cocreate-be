const mongoose = require("mongoose");

const ProposalVoteMappingSchema = new mongoose.Schema({
    proposalId: { type: String, required: true },
    userId: { type: String, required: true },

    voteValue: { type: String, required: true },
});

const ProposalVoteMapping = mongoose.model("ProposalVoteMapping", ProposalVoteMappingSchema);

module.exports = ProposalVoteMapping;
