const User = require('../models/user');
const Entity = require('../models/entity');
const Project = require('../models/project');
const Proposal = require('../models/proposal');
const Task = require('../models/task');
const Submission = require('../models/submission');
const SubmissionVoteMapping = require('../models/submissionVoteMapping');
const ProposalVoteMapping = require('../models/proposalVoteMappingg');
const ProjectContributer = require('../models/projectContributer');

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
            const { userId, value } = req.body;

            const proposal = await Proposal.findOne({ entityId: entityId, projectId: projectId, proposalId: proposalId });
            if (!proposal) {
                return {success: false, error: "Can not find project proposal with the provided id"}
            }

            const user = await User.findOne({ userId: userId });
            if (!user) {
                return {success: false, error: "Can not find user with the provided id"}
            }

            const contributerMapping = await ProjectContributer.findOne({userId: userId, entityId: entityId, projectId: projectId});
            if (!contributerMapping || contributerMapping.role == 'READER') {
                return {success: false, error: "You dont have permissions to vote on the proposal"}
            }

            const proposalVoteMapping = await ProposalVoteMapping.findOne({proposalId:proposalId, userId: userId});
            if (proposalVoteMapping && proposalVoteMapping.voteValue == value) {
                return {success: false, error: "Already voted with the same value before"};
            }

            await ProposalVoteMapping.findOneAndUpdate({proposalId: proposalId, userId: userId}, {
                proposalId: proposalId, 
                userId: userId,
                voteValue: value
            }, { upsert: true, setDefaultsOnInsert: true });

            return { success:true};
        } catch (error) {
            console.log("ProposalFunctions:voteOnProposal: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getProposalVotes(req) {
        console.log("ProposalFunctions:getProposalVotes ");
        try {
            const { entityId, projectId, proposalId } = req.params;

            const proposal = await Proposal.findOne({ entityId: entityId, projectId: projectId, proposalId: proposalId });
            if (!proposal) {
                return {success: false, error: "Can not find project proposal with the provided id"}
            }

            const votes = await ProposalVoteMapping.find({proposalId: proposalId}, {_id: 0, userId: 1, voteValue: 1});

            return { success:true, data: votes };
        } catch (error) {
            console.log("ProposalFunctions:getProposalVotes: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async executeProposal(req) {
        console.log("ProposalFunctions:executeProposal ");
        try {
            const { entityId, projectId, proposalId } = req.params;
            const { userId, tasks } = req.body;

            const proposal = await Proposal.findOne({ entityId: entityId, projectId: projectId, proposalId: proposalId });
            if (!proposal) {
                return {success: false, error: "Can not find proposal with the provided id"}
            }

            if (!proposal.authors.includes(userId)) {
                return {success: false, error: "Only project owners can create tasks for a project proposal"}
            }

            for (var i in tasks) {
                const task = tasks[i];
                const taskId = "t-" +  uuidv4();
                var taskDoc = new Task({
                    entityId: entityId,
                    taskId: taskId,
                    parentProposalId: proposalId,
                    title: task.title,
                    description: task.description, 
                    eta: task.eta,
                    minXP: task.minXP,
                    assignee: task.assignee,
                    status: task.assignee ? 'NOT_STARTED' : 'UNASSIGNED'
                });
                await taskDoc.save();
            }

            return { success:true };
        } catch (error) {
            console.log("ProposalFunctions:executeProposal: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async createNewTaskForProposal(req) {
        console.log("ProposalFunctions:createNewTaskForProposal ");
        try {
            const { entityId, projectId, proposalId } = req.params;
            const { userId, title, description, eta, minXP, assignee } = req.body;

            const proposal = await Proposal.findOne({ entityId: entityId, projectId: projectId, proposalId: proposalId });
            if (!proposal) {
                return {success: false, error: "Can not find proposal with the provided id"}
            }

            if (!proposal.authors.includes(userId)) {
                return {success: false, error: "Only project owners can create tasks for a project proposal"}
            }

            const taskId = "t-" +  uuidv4();
            var taskDoc = new Task({
                entityId: entityId,
                taskId: taskId,
                parentProposalId: proposalId,
                title: title,
                description: description, 
                eta: eta,
                minXP: minXP,
                assignee: assignee,
                status: assignee ? 'NOT_STARTED' : 'UNASSIGNED'
            });
            await taskDoc.save();

            return { success:true, id: taskId };
        } catch (error) {
            console.log("ProposalFunctions:createNewTaskForProposal: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getProposalTasks(req) {
        console.log("ProposalFunctions:getProposalTasks ");
        try {
            const { entityId, projectId, proposalId } = req.params;

            const proposal = await Proposal.findOne({ entityId: entityId, projectId: projectId, proposalId: proposalId });
            if (!proposal) {
                return {success: false, error: "Can not find project proposal with the provided id"}
            }

            const tasks = await Task.find({entityId: entityId, parentProposalId: proposalId}, {_id: 0, __v: 0});

            return { success:true, data: tasks };
        } catch (error) {
            console.log("ProposalFunctions:getProposalTasks: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }
}

module.exports = ProposalFunctions;
