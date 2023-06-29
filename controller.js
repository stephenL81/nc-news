
const {returnTopics,returnArticle,returnAllArticles} = require("./model")
const data = require('./endpoints.json')



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

function getApi(req, res){
    res.status(200).send(data)
}

function getAllArticles(req,res){
    returnAllArticles()
    .then(data =>{
        res.status(200).send(data)
    })
}

module.exports = {getTopics,getApi,getArticle, getAllArticles};

