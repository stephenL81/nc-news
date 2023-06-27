const returnTopics = require("./model")

function getTopics(req, res){
returnTopics()
.then(data => {
    res.status(200).send(data)
})
}


module.exports = getTopics;