const User = require('../models/user');
const Entity = require('../models/entity');
const Project = require('../models/project');
const Proposal = require('../models/proposal');
const Task = require('../models/task');
const Submission = require('../models/submission');
const SubmissionVoteMapping = require('../models/submissionVoteMapping');

const { v1: uuidv1, v4: uuidv4 } = require('uuid');

class ProposalFunctions {
    async createTasksForProposal(req) {
        console.log("ProposalFunctions:createTasksForProposal ");
        try {
            const { entityId, projectId } = req.params;

            const entity = await Entity.findOne({ entityId: entityId });
            if (!entity) {
                return {success: false, error: "Can not find entity with the provided id"}
            }

            const project = await Project.findOne({entityId: entityId, projectId: projectId});
            const proposals = await Proposal.find({ projectId: projectId });

            return { success:true, data: { project_data : project, proposals_data: proposals }};
        } catch (error) {
            console.log("ProposalFunctions:createTasksForProposal: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getAllProposalsForProject(req) {
        console.log("ProposalFunctions:getAllProposalsForProject ");
        try {
            const { entityId } = req.params;

            const entity = await Entity.findOne({ entityId: entityId });
            if (!entity) {
                return {success: false, error: "Can not find entity with the provided id"}
            }

            const projects = await Project.find({entityId: entityId});

            return { success:true, data: projects};
        } catch (error) {
            console.log("ProposalFunctions:getAllProposalsForProject: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async voteOnTaskSubmission(req) {
        console.log("ProposalFunctions:voteOnProposal ");
        try {
            const { entityId, projectId } = req.params;

            const entity = await Entity.findOne({ entityId: entityId });
            if (!entity) {
                return {success: false, error: "Can not find entity with the provided id"}
            }

            const project = await Project.findOne({entityId: entityId, projectId: projectId});
            const proposals = await Proposal.find({ projectId: projectId });

            return { success:true, data: { project_data : project, proposals_data: proposals }};
        } catch (error) {
            console.log("ProposalFunctions:voteOnProposal: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }
}

module.exports = ProposalFunctions;
