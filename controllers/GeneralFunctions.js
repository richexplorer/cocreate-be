const User = require('../models/user');
const config = require('../config/config');

class GeneralFunctions {
    async testFunction() {
        console.log("GeneralFunctions:testFunction ");
        try {
            return {success:true};
        } catch (error) {
            console.log("GeneralFunctions:testFunction: Catch block");
            console.log(error);
            return {success:false, error: "Internal Server Error. Please contact Help Center in Discord."};
        }
    }
}

module.exports = GeneralFunctions;
