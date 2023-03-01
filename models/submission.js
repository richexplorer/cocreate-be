const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
    submissionId: { type: String, required: true },
    taskId: { type: String, required: true },
    
    title: { type: String },
    description: { type: String },
    imageLink: { type: String }, 
    xpAsk: { type: Number }, 
    createdAt: {type: Date, default: Date.now()}
});

const Submission = mongoose.model("Submission", SubmissionSchema);

module.exports = Submission;
