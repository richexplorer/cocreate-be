const User = require('../models/user');
const Entity = require('../models/entity');
const Project = require('../models/project');
const Proposal = require('../models/proposal');
const Task = require('../models/task');
const Submission = require('../models/submission');
const SubmissionVoteMapping = require('../models/submissionVoteMapping');
const ProposalVoteMapping = require('../models/proposalVoteMapping');

const { v1: uuidv1, v4: uuidv4 } = require('uuid');

class ProposalFunctions {
    async createOrUpdateProposal(req) {
        console.log("ProposalFunctions:createOrUpdateProposal ");
        try {
            const { title, description, imageLink, status, values, expiresAt, authors } = req.body;
            const { entityId, projectId, proposalId } = req.params;

            const project = await Project.findOne({ entityId: entityId, projectId: projectId });
            if (!project) {
                return {success: false, error: "Can not find project with the provided id"}
            }

            const id = proposalId ? proposalId : "pp-" + uuidv4();
            await Proposal.findOneAndUpdate({ projectId: projectId, entityId: entityId, proposalId: id }, {
                projectId: projectId,
                entityId: entityId,
                proposalId: id,
                title: title,
                description: description,
                imageLink: imageLink,
                expiresAt: expiresAt,
                authors: authors,
                status: status ? status : "DRAFT",
                values: values ? values : ["Yes", "No"]
            }, {
                upsert: true, 
                setDefaultsOnInsert:true
            });

            return { success:true, data: id};
        } catch (error) {
            console.log("ProposalFunctions:createOrUpdateProposal: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getAllProposalsForProject(req) {
        console.log("ProposalFunctions:getAllProposalsForProject ");
        try {
            const { entityId, projectId } = req.params;

            const project = await Project.findOne({ entityId: entityId, projectId: projectId });
            if (!project) {
                return {success: false, error: "Can not find project with the provided id"}
            }

            const proposals = await Proposal.find({entityId: entityId, projectId: projectId});

            return { success:true, data: proposals };
        } catch (error) {
            console.log("ProposalFunctions:getAllProposalsForProject: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getProposalDetailsForProject(req) {
        console.log("ProposalFunctions:getProposalDetailsForProject ");
        try {
            const { entityId, projectId, proposalId } = req.params;

            const project = await Project.findOne({ entityId: entityId, projectId: projectId });
            if (!project) {
                return {success: false, error: "Can not find project with the provided id"}
            }

            const proposal = await Proposal.findOne({entityId: entityId, projectId: projectId, proposalId: proposalId});
            const proposalVotes = await ProposalVoteMapping.find({proposalId: proposalId});

            return { success:true, data: proposal, votes_data: proposalVotes};
        } catch (error) {
            console.log("ProposalFunctions:getProposalDetailsForProject: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async voteOnProposalOnDiscord(req) {
        console.log("ProposalFunctions:voteOnProposal ");
        try {
            const { entityId, projectId, proposalId } = req.params;
            const { userId } = req.body;

            const proposal = await Proposal.findOne({ entityId: entityId, projectId: projectId, proposalId: proposalId });
            if (!project) {
                return {success: false, error: "Can not find project proposal with the provided id"}
            }

            const user = await User.findOne({ userId: userId });
            if (!user) {
                return {success: false, error: "Can not find user with the provided id"}
            }

            

            return { success:true, data: { project_data : project, proposals_data: proposals }};
        } catch (error) {
            console.log("ProposalFunctions:voteOnProposal: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async createTasksForProposal(req) {
        console.log("ProposalFunctions:createTasksForProposal ");
        try {
            const { entityId, projectId } = req.params;

            const project = await Project.findOne({ entityId: entityId, projectId: projectId });
            if (!project) {
                return {success: false, error: "Can not find project with the provided id"}
            }

            // const project = await Project.findOne({entityId: entityId, projectId: projectId});
            const proposals = await Proposal.find({ projectId: projectId });

            return { success:true, data: { project_data : project, proposals_data: proposals }};
        } catch (error) {
            console.log("ProposalFunctions:createTasksForProposal: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }
}

module.exports = ProposalFunctions;
