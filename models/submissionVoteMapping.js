const mongoose = require("mongoose");

const SubmissionVoteMappingSchema = new mongoose.Schema({
    mappingId: { type: String, required: true },
    submissionId: { type: String, required: true },
    userId: { type: String, required: true },

    voteValue: { type: String, required: true },
});

const SubmissionVoteMapping = mongoose.model("SubmissionVoteMapping", SubmissionVoteMappingSchema);

module.exports = SubmissionVoteMapping;
