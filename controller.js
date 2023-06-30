
const {returnTopics,returnArticle,returnAllArticles,returnArticleComments} = require("./model")
const endpointsData = require('./endpoints.json')




function getTopics(req, res, next){
    returnTopics()
    .then(data => {
    res.status(200).send({'topics': data})
    })
    .catch(next)
    }

    function getArticleComments(req, res,next){
    const articleId = req.params.article_id
    console.log(articleId)
    if(isNaN(articleId)){
    res.status(400).send({msg: "Bad Request"})
    }
    
    returnArticleComments(articleId)
    .then(comments=>{
        // if(comments.length === 0){
        // res.status(200).send({ msg : 'There are currently no comments for this article'})
        // }
        // else{
            res.status(200).send({comments})
        
    })
    .catch((error)=>{
        if(error.status === 404){
            res.status(404).send({msg : 'Not Found'})
        }
        else{
        next(error);
        }
    })
    }

    
    function getArticle(req, res, next){
    const articleId =req.params.article_id

    if(isNaN(articleId)){
   res.status(400).send({msg: "Bad Request"})
    }
    returnArticle(articleId)
    .then((articleData)=>{
    const article = articleData[0]
    res.status(200).send({"article" :article})
    })
    .catch((error) => {
        if (error.message === 'Not Found') {
          res.status(404).send({ msg: 'Not Found' });
        } else {
          next(error);
        }
      });
}

    function getApi(req, res){
    res.status(200).send(endpointsData)
    }



function getAllArticles(req,res){
    returnAllArticles()
    .then(data =>{
        res.status(200).send(data)
    })
}

module.exports = {getTopics,getApi,getArticle, getAllArticles, getArticleComments};

