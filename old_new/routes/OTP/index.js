const Verify = require("./verify.js");
const Generate = require("./generate.js");

const otp = new Map([
    ['/verify',Verify],
    ['/generate',Generate]
]);

module.exports = otp;