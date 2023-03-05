const User = require('../models/user');
const Entity = require('../models/entity');
const Project = require('../models/project');
const Proposal = require('../models/proposal');
const Task = require('../models/task');
const Submission = require('../models/submission');
const SubmissionVoteMapping = require('../models/submissionVoteMapping');
const axios = require('axios');
const qs = require('qs');

const { v1: uuidv1, v4: uuidv4 } = require('uuid');

class UserFunctions {
    async addOrUpdateUserForEntity(req) {
        console.log("UserFunctions:createOrUpdateUser ");
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
            console.log("UserFunctions:createOrUpdateUser: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async getAllRegisteredUsers(req) {
        console.log("UserFunctions:getAllRegisteredUsers ");
        try {
            const { entityId } = req.params;

            const users = await User.find({entityId: entityId});

            return { success:true, data: users};
        } catch (error) {
            console.log("UserFunctions:getAllRegisteredUsers: Catch block");
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

    async connectDiscordAndEthWallet(req) {
        console.log("UserFunctions:connectEthAddressWithDiscordId ");
        try {
          const { discordCode, address, entityId } = req.body;

          if (!discordCode || !address) {
            return {success: false, error: "Eth address or the discord code not found"};
          }

          const accessTokenResponse = await axios({
            method: "post",
            url: `https://discord.com/api/oauth2/token`,
            data: qs.stringify({
              client_id: "1080238151404093510",
              client_secret: "JKnL2R9G4ELT-8sMZHPabuzoML03di22",
              grant_type: "authorization_code",
              code: discordCode,
              redirect_uri: "http://localhost:3000/",
            }),
            headers: {
              "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          });

          let userDetails = {
            method: "get",
            url: "https://discord.com/api/users/@me",
            headers: {
              Authorization: `Bearer ${accessTokenResponse.data.access_token}`,
            },
          };

          const response = await axios(userDetails);
          console.log(response);

          const { username } = response.data;

         // discordId is discord username
          var user = await User.findOne({ entityId: entityId, discordId: username });
          var userId;
          if (!user) {
                userId = "u-" +  uuidv4();
                user = new User({
                    userId: userId,
                    discordId: username,
                    entityId: entityId
                });
                await user.save();
                user = await User.findOne({ entityId: entityId, discordId: username });
            }

            var addresses = user.addresses ? user.addresses : [];
            if (addresses) {
                // Check if the address is already present
                for (var add in addresses) {
                    if (addresses[add].address == address) {
                        return {success: false, error: "User already connected to this eth address"}
                    }
                }

                const entry = { address: address, chain: "ETH" };
                addresses.push(entry);
            }

            await User.findOneAndUpdate({ entityId: entityId, discordId: username }, {addresses: addresses});

            return {success: true};
        } catch (error) {
            console.log("UserFunctions:connectEthAddressWithDiscordId: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }
}

module.exports = UserFunctions;
