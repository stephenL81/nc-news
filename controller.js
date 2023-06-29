
const {returnTopics,returnArticle,returnArticles} = require("./model")
const fs = require('fs')
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

function getArticles(req,res){
    console.log('in controller')
    returnArticles()
    .then(data =>{
        res.status(200).send(data)
    })
}

module.exports = {getTopics,getApi,getArticles};

