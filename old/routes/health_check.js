const  Router  = require ('express')

const health = Router({ strict: true });

health.get('/', (req, res) => {
    res.status(200).json({message:"Check completed"})
})

module.exports = health;