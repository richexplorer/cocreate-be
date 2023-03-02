const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    entityId: { type: String, required: true },
    taskId: { type: String, required: true },
    parentProposalId: { type: String, required: true },
    assignee: { type: String }, // userId

    title: { type: String },
    description: { type: String },
    eta: { type: Date },
    minXP: { type: Number, default: 0 },
    status: { type: String, enum : [
        'UNASSIGNED', 
        'NOT_STARTED',
        'IN_PROGRESS',
        'IN_REVIEW',
        'COMPLETED',
        'DISCARDED',
    ], default: 'UNASSIGNED'},
    createdAt: {type: Date, default: Date.now()}
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
