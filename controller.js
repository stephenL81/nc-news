
const {returnTopics,returnArticle} = require("./model")
const fs = require('fs')
const endpointsData = require('./endpoints.json')



function getTopics(req, res, next){
    returnTopics()
    .then(data => {
    res.status(200).send({'topics': data})
    })
    .catch(next)
    }

function getArticle(req, res, next){
    const articleId =req.params.article_id
    console.log(articleId)
    if(isNaN(articleId))
    {
    res.status(400).send({msg: "Bad Request"})
    }
    returnArticle(articleId)
    .then((articleData)=>{
    if(articleData.length === 0){
          return  res.status(404).send({msg: "Not Found"})
        }
    const article = articleData[0]
    res.status(200).send({"article" :article})
    })
    .catch(next)
}

    function getApi(req, res){
    res.status(200).send(endpointsData)
}



module.exports = {getTopics,getApi,getArticle};

