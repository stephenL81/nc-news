const {returnTopics,returnArticle} = require("./model")

function getTopics(req, res, next){
    
returnTopics()
.then(data => {
    
    res.status(200).send({'topics': data})
})
.catch(next)
}

function getArticle(req, res){
    returnArticle()

}

module.exports = {getTopics, getArticle}