const User = require('../models/user');
const Entity = require('../models/entity');
const Project = require('../models/project');
const Proposal = require('../models/proposal');
const Task = require('../models/task');
const Submission = require('../models/submission');
const SubmissionVoteMapping = require('../models/submissionVoteMapping');

const { v1: uuidv1, v4: uuidv4 } = require('uuid');

class UserFunctions {
    async addOrUpdateUserForEntity(req) {
        console.log("UserFunctions:createOrUpdateEntity ");
        try {
            const { discordId, address, emailId } = req.body;
            const { entityId, userId } = req.params;

            const user = await User.findOne({ entityId: entityId, userId: userId });
            var addresses = user && user.addresses ? user.addresses : [];

            if (addresses && address) {
                // Check if the address is already present

                for (var add in addresses) {
                    console.log(add);
                    if (addresses[add].address == address) {
                        return {success: false, error: "User already connected to this eth address"}
                    }
                }
                
                const entry = { address: address, chain: "ETH" };
                addresses.push(entry);
            }
            const id = userId ? userId : "u-" + uuidv4();
            await User.findOneAndUpdate({ entityId: entityId, userId: userId }, {
                entityId: entityId,
                userId: id,
                discordId: discordId ? discordId : user && user.discordId,
                addresses: addresses,
                emailId: emailId ? emailId : user && user.emailId,
            }, {
                upsert: true, 
                setDefaultsOnInsert:true
            });

            return { success:true, data: id};
        } catch (error) {
            console.log("UserFunctions:createOrUpdateEntity: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getAllRegisteredUsers(req) {
        console.log("UserFunctions:getAllEntities ");
        try {
            const { entityId } = req.params;

            const users = await User.find({entityId: entityId});

            return { success:true, data: users};
        } catch (error) {
            console.log("UserFunctions:getAllEntities: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getUserForDiscordId(req) {
        console.log("UserFunctions:getUserForDiscordId ");
        try {
            const { entityId, discordId } = req.params;

            const user = await User.findOne({entityId: entityId, discordId: discordId });

            return { success:true, data: user ? user.userId : null };
        } catch (error) {
            console.log("UserFunctions:getUserForDiscordId: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async addEthWalletForUser(req) {
        console.log("UserFunctions:addEthWalletForUser ");
        try {
            const { address } = req.body;
            const { entityId, userId } = req.params;

            const user = await User.findOne({ entityId: entityId, userId: userId });
            if (!user) {
                return {success: false, error: "Can not find user with the provided id"}
            }

            var addresses = user.addresses ? user.addresses : [];
            if (addresses && address) {
                // Check if the address is already present

                for (var add in addresses) {
                    if (addresses[add].address == address) {
                        return {success: false, error: "User already connected to this eth address"}
                    }
                }

                const entry = { address: address, chain: "ETH" };
                addresses.push(entry);
            }

            await User.findOneAndUpdate({ entityId: entityId, userId: userId }, {addresses: addresses});

            return { success:true };
        } catch (error) {
            console.log("UserFunctions:addEthWalletForUser: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }
}

module.exports = UserFunctions;
