const User = require('../models/user');
const Entity = require('../models/entity');
const Project = require('../models/project');
const Proposal = require('../models/proposal');
const Task = require('../models/task');
const Submission = require('../models/submission');
const SubmissionVoteMapping = require('../models/submissionVoteMapping');
const ProjectContributer = require('../models/projectContributer');
const axios = require('axios');

const { v1: uuidv1, v4: uuidv4 } = require('uuid');

class ProjectFunctions {
    async createOrUpdateProject(req) {
        console.log("ProjectFunctions:createOrUpdateProject ");
        try {
            const { title, description, imageLink, links, expiresAt, authors, discordWebhookURL, discordChannelId, discordChannelName } = req.body;
            const { entityId, projectId } = req.params;

            const entity = await Entity.findOne({ entityId: entityId });
            if (!entity) {
                return {success: false, error: "Can not find entity with the provided id"}
            }

            const id = projectId ? projectId : "p-" + uuidv4();
            await Project.findOneAndUpdate({ projectId: id, entityId: entityId }, {
                projectId: id,
                entityId: entityId,
                title: title,
                description: description,
                imageLink: imageLink,
                links: links,
                expiresAt: expiresAt,
                authors: authors,
                discordWebhookURL: discordWebhookURL,
                discordChannelId: discordChannelId,
                discordChannelName: discordChannelName
            }, {
                upsert: true, 
                setDefaultsOnInsert:true
            });

            await this._postNewProjectOnDiscord(entityId, id);

            return { success:true, data: id};
        } catch (error) {
            console.log("ProjectFunctions:createOrUpdateProject: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getAllProjectsForEntity(req) {
        console.log("ProjectFunctions:getAllProjectsForEntity ");
        try {
            const { entityId } = req.params;

            const entity = await Entity.findOne({ entityId: entityId });
            if (!entity) {
                return {success: false, error: "Can not find entity with the provided id"}
            }

            const projects = await Project.find({entityId: entityId});

            return { success:true, data: projects};
        } catch (error) {
            console.log("ProjectFunctions:getAllProjectsForEntity: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getProjectDetails(req) {
        console.log("ProjectFunctions:getProjectDetails ");
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
            console.log("ProjectFunctions:getProjectDetails: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getProjectDetailsWithDiscordChannelId(req) {
        console.log("ProjectFunctions:getProjectDetailsWithDiscordChannelId ");
        try {
            const { entityId, discordChannelId } = req.params;

            const entity = await Entity.findOne({ entityId: entityId });
            if (!entity) {
                return {success: false, error: "Can not find entity with the provided id"}
            }

            const project = await Project.findOne({entityId: entityId, discordChannelId: discordChannelId});
            if (!project) {
                return {success: false, error: "Can not find project with the provided id"}  
            }

            const proposals = await Proposal.find({ projectId: project.projectId });

            return { success:true, data: { project_data : project, proposals_data: proposals }};
        } catch (error) {
            console.log("ProjectFunctions:getProjectDetailsWithDiscordChannelId: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async joinProjectOrUpdateRoleWithDiscordId(req) {
        console.log("ProjectFunctions:joinProjectOrUpdateRoleWithDiscordId ");
        try {
            const { userDiscordId, role } = req.body;
            const { entityId, projectId } = req.params;

            var user = await User.findOne({ discordId: userDiscordId });
            var userId = user ? user.userId : null;
            if (!user) {
                userId = "u-" +  uuidv4();
                user = new User({
                    userId: userId,
                    discordId: userDiscordId,
                    entityId: entityId
                });
                await user.save();
            }

            await ProjectContributer.findOneAndUpdate({ userId: userId, entityId: entityId, projectId: projectId }, {
                userId: userId,
                discordId: userDiscordId,
                entityId: entityId,
                projectId: projectId,
                role: role ? role : "READER"
            }, {
                upsert: true, 
                setDefaultsOnInsert:true
            });

            return { success:true };
        } catch (error) {
            console.log("ProjectFunctions:joinProjectOrUpdateRoleWithDiscordId: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async joinProjectOrUpdateRole(req) {
        console.log("ProjectFunctions:joinProjectOrUpdateRole ");
        try {
            const { userId, role } = req.body;
            const { entityId, projectId } = req.params;

            var user = await User.findOne({ userId: userId });
            if (!user) {
                return {success: false, error: "User not found with the provided id"}
            }

            await ProjectContributer.findOneAndUpdate({ userId: userId, entityId: entityId, projectId: projectId }, {
                userId: userId,
                entityId: entityId,
                projectId: projectId,
                role: role ? role : "READER"
            }, {
                upsert: true, 
                setDefaultsOnInsert:true
            });

            return { success:true };
        } catch (error) {
            console.log("ProjectFunctions:joinProjectOrUpdateRole: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getProjectUsers(req) {
        console.log("ProjectFunctions:getProjectUsers ");
        try {
            const { entityId, projectId } = req.params;

            const project = await Project.findOne({ entityId: entityId, projectId: projectId });
            if (!project) {
                return {success: false, error: "Can not find project with the provided id"}
            }

            const users = await ProjectContributer.find({ entityId: entityId, projectId: projectId }, {role: 1, userId: 1, _id: 0});

            return { success:true, data: users };
        } catch (error) {
            console.log("ProjectFunctions:getProjectUsers: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    // PRIVATE FUNCTIONS

    async _postNewProjectOnDiscord(entityId, projectId) {
        console.log("ProjectFunctions:_postNewProjectOnDiscord: " + projectId);
        try {
            var project = await Project.findOne({entityId: entityId, projectId: projectId});
            if (!project || !project.discordWebhookURL) {
                console.log("ProjectFunctions:_postNewProjectOnDiscord: Error: Project not posted on discord as its not found in the DB, id = " + projectId);
                return false;
            }

            let params = {
                username: 'Co-Create Bot',
                avatar_url: 'http://cocreate.blogs.lincoln.ac.uk/files/2016/11/Co-Create-Logo1.png',
                embeds: [{
                    title: "New Project Created - " + project.title,
                    description: project.description + ".. This channel will be used to create proposals about the above and vote on them. Lets get it done!"
                }]
            };
    
            var response = await axios({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(params),
                url: project.discordWebhookURL,
            });

            return true;
        } catch (err) {
            console.log("ProjectFunctions:_postNewProjectOnDiscord: Internal Server Error");
            console.log(err);
            return false;
        }
    }
}

module.exports = ProjectFunctions;
