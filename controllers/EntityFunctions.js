const User = require('../models/user');
const Entity = require('../models/entity');
const Project = require('../models/project');
const Proposal = require('../models/proposal');
const Task = require('../models/task');
const Submission = require('../models/submission');
const SubmissionVoteMapping = require('../models/submissionVoteMapping');

const { v1: uuidv1, v4: uuidv4 } = require('uuid');

class EntityFunctions {
    async createOrUpdateEntity(req) {
        console.log("EntityFunctions:createOrUpdateEntity ");
        try {
            const { title, description, imageLink, authors, preferences } = req.body;
            const { entityId } = req.params;

            const id = entityId ? entityId : "e-" + uuidv4();
            await Entity.findOneAndUpdate({ entityId: entityId }, {
                entityId: id,
                title: title,
                description: description,
                imageLink: imageLink,
                authors: authors,
                preferences: preferences
            }, {
                upsert: true, 
                setDefaultsOnInsert:true
            });

            return { success:true, data: id};
        } catch (error) {
            console.log("EntityFunctions:createOrUpdateEntity: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getAllEntities(req) {
        console.log("EntityFunctions:getAllEntities ");
        try {
            const entities = await Entity.find();

            return { success:true, data: entities};
        } catch (error) {
            console.log("EntityFunctions:getAllEntities: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getEntityDetails(req) {
        console.log("EntityFunctions:getEntityDetails ");
        try {
            const { entityId } = req.params;

            const entity = await Entity.findOne({ entityId: entityId });
            if (!entity) {
                return {success: false, error: "Can not find entity with the provided id"}
            }

            return { success:true, data: entity };
        } catch (error) {
            console.log("EntityFunctions:getEntityDetails: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }
}

module.exports = EntityFunctions;
