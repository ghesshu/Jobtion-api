const  Router  = require ('express')

const welcome = Router({ strict: true });

welcome.get('/', (req, res) => {
    res.send("<h1>Jobtion API</h1>")
})

module.exports = welcome;