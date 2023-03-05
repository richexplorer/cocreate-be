const User = require('../models/user');
const axios = require('axios');

class GeneralFunctions {
    async addXPforUser(xp, userId, entityId) {
        console.log("GeneralFunctions:addXPforUser ");
        try {

            var user = await User.findOne({ entityId: entityId, userId: userId });
            if (user.addresses.count == 0) {
                return {success:false};    
            }

            const userAddress = user.addresses[0].address;
            axios.post(`http://api.questprotocol.xyz/api/entities/c-82bc9c1d-564c-4a5b-8602-ea1ce937d4ad/add-xp&address=0x493018dbc67d03fa1b78e31b4e66ba8c8a82be81&signature=0xead28ac8f16d394e890b3c7327fcb07b415864bd97a3c4d122631acbe2c6d56b59fc7f2eeea05e40bb9170142b8ab3d853af9b69a438d23862a9480dc09b09521c`, {
                forAddress: userAddress,
                xp: xp
            }, {
                headers: {
                  'Content-Type': 'application/json',
                },
              })

            return {success:true};
        } catch (error) {
            console.log("GeneralFunctions:addXPforUser: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }

    async mintDynamicNFT(userId, entityId) {
        console.log("GeneralFunctions:mintDynamicNFT ");
        try {

            var user = await User.findOne({ entityId: entityId, userId: userId });
            console.log(user);
            if (!user || !user.addresses || user.addresses.count == 0) {
                return {success:false};    
            }

            const userAddress = user.addresses[0].address;
            await axios.post(`http://api.questprotocol.xyz/api/entities/c-82bc9c1d-564c-4a5b-8602-ea1ce937d4ad/mint?type=STATIC_MEDIA&forAddress=${userAddress}&address=0x493018dbc67d03fa1b78e31b4e66ba8c8a82be81&signature=0xead28ac8f16d394e890b3c7327fcb07b415864bd97a3c4d122631acbe2c6d56b59fc7f2eeea05e40bb9170142b8ab3d853af9b69a438d23862a9480dc09b09521c`, {}, {
                headers: {
                  'Content-Type': 'application/json',
                },
            });

            return {success:true};
        } catch (error) {
            console.log("GeneralFunctions:mintDynamicNFT: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }
}

module.exports = GeneralFunctions;
