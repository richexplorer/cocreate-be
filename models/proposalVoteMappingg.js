const mongoose = require("mongoose");

const SubmissionVoteMappingSchema = new mongoose.Schema({
    mappingId: { type: String, required: true },
    proposalId: { type: String, required: true },
    userId: { type: String, required: true },

    voteValue: { type: String, required: true },
});

const ProposalVoteMapping = mongoose.model("ProposalVoteMapping", SubmissionVoteMappingSchema);

module.exports = ProposalVoteMapping;
