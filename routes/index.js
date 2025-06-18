const Auth = require("./Auth/index");
const User = require("./User/index");
const OTP = require("./OTP/index");

const all_routes = new Map([...Auth, ...User, ...OTP]);

module.exports = all_routes;
