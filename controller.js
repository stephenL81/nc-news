const returnTopics = require("./model")

function getTopics(req, res, next){
    
returnTopics()
.then(data => {
    
    res.status(200).send({'topics': data})
})
.catch(next)
}


module.exports = getTopics;