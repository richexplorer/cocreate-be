const mongoose = require("mongoose");

const ProjectContributerSchema = new mongoose.Schema({
    userId: { type: String, required: true },  
    entityId: { type: String, required: true }, 
    projectId: { type: String, required: true }, 
    role: { type: String, enum : [
        'CONTRIBUTER', 
        'INVESTOR',
        'VOTER',
        'READER',
    ], default: 'READER'},
    joinedAt: {type: Date, default: Date.now()}
});

const ProjectContributer = mongoose.model("ProjectContributer", ProjectContributerSchema);

module.exports = ProjectContributer;
