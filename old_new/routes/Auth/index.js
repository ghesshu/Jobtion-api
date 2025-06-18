const Login = require("./login.js");
const Register = require('./signup.js')

const auth = new Map([
    ['/login',Login],
    ['/register',Register]
]);

module.exports = auth;