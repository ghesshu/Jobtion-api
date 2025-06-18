const jwt = require('jsonwebtoken');
const { config } = require('dotenv');
const Response = require('./standardResponse');
config();

const expiresInOneYear = 365 * 24 * 60 * 60

const generateToken = (data, access = true) => {
    const secret = access
        ? process.env.ACCESS_TOKEN_SECRET
        : "wrong";
    const expiry = access
        ? process.env.ACCESS_TOKEN_EXPIRY * 5
        : 0;
    return jwt.sign(data, secret, { expiresIn: parseInt(expiry) });
};

const verifyToken = (res,token, access = true) => {
    const secret = access
        ? process.env.ACCESS_TOKEN_SECRET
        : "Wrong";
    try {
        return jwt.verify(token, secret);
    } catch (err) {
            res.status(422).json(
            Response({
              success: false,
              message: `Unauthorized: ${err.message}`,
            })
          );
    }
};


module.exports = {generateToken, verifyToken};