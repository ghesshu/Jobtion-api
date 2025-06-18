const Login = require("./login.js");
const Register = require('./signup.js')
const singleSignOn = require('./single-sign-on.js')
const resetPassword = require('./reset-password.js')
const forgetPassword = require('./forget-password.js')
const createAdmin = require('./admin/create-admin.js')
const authenticate = require('./admin/authenticate.js')
const updateAdmin = require('./admin/update-admin.js')

const auth = new Map([
    ['/login',Login],
    ['/register',Register],
    ['/single-sign-on',singleSignOn],
    ['/reset-password',resetPassword],
    ['/forget-password',forgetPassword],
    ['/create-admin',createAdmin],
    ['/authenticate',authenticate],
    ['/update-admin',updateAdmin]
]);

module.exports = auth;