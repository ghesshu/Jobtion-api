const  Router  = require ('express')
const db = require('../db/connection_new');

const delete_user = Router({ strict: true });

delete_user.delete('/', (req, res) => {
    try {
        db.query("DELETE FROM users WHERE email = ?", [req.body.email])
        res.status(200).json({message:"User deleted"})
    } catch (error) {
        res.status(200).json({message:`${error.message}`})
    }
})

module.exports = delete_user;