const User = require('../models/user');
const Entity = require('../models/entity');
const Project = require('../models/project');
const Proposal = require('../models/proposal');
const Task = require('../models/task');
const Submission = require('../models/submission');
const SubmissionVoteMapping = require('../models/submissionVoteMapping');

const { v1: uuidv1, v4: uuidv4 } = require('uuid');

class TaskSubmissionFunctions {
    async getSubmissionsForTask(req) {
        console.log("TaskSubmissionFunctions:getSubmissionsForTask ");
        try {
            const { entityId, projectId, proposalId } = req.params;
            const { userId, title, description, xpAsk } = req.body;

            const proposal = await Proposal.findOne({ entityId: entityId, projectId: projectId, proposalId: proposalId });
            if (!proposal) {
                return {success: false, error: "Can not find proposal with the provided id"}
            }

            const project = await Project.findOne({entityId: entityId, projectId: projectId});
            const proposals = await Proposal.find({ projectId: projectId });

            return { success:true };
        } catch (error) {
            console.log("TaskSubmissionFunctions:getSubmissionsForTask: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async createNewTaskSubmission(req) {
        console.log("TaskSubmissionFunctions:createNewTaskSubmission ");
        try {
            const { entityId, projectId, proposalId } = req.params;
            const { userId, title, description, xpAsk } = req.body;

            const proposal = await Proposal.findOne({ entityId: entityId, projectId: projectId, proposalId: proposalId });
            if (!proposal) {
                return {success: false, error: "Can not find proposal with the provided id"}
            }

            const project = await Project.findOne({entityId: entityId, projectId: projectId});
            const proposals = await Proposal.find({ projectId: projectId });

            return { success:true };
        } catch (error) {
            console.log("TaskSubmissionFunctions:createNewTaskSubmission: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async voteOnTaskSubmission(req) {
        console.log("TaskSubmissionFunctions:voteOnTaskSubmission ");
        try {
            const { entityId, projectId } = req.params;

            const entity = await Entity.findOne({ entityId: entityId });
            if (!entity) {
                return {success: false, error: "Can not find entity with the provided id"}
            }

            const project = await Project.findOne({entityId: entityId, projectId: projectId});
            const proposals = await Proposal.find({ projectId: projectId });

            return { success:true };
        } catch (error) {
            console.log("TaskSubmissionFunctions:voteOnTaskSubmission: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }
}

module.exports = TaskSubmissionFunctions;
