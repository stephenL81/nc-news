
const {returnTopics,returnArticle,returnAllArticles,returnArticleComments,addCommentToDb} = require("./model")
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
    if(isNaN(+articleId)){
    res.status(400).send({msg: "Bad Request"})
    }
    
    returnArticleComments(articleId)
    .then(comments =>{
        res.status(200).send({comments})
        })
        .catch(err =>{
            next(err)
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

function addComment(req , res , next){
    const articleId = req.params.article_id;
    const username = req.body.username;   // why am I getting undefined for what is sent???
    const body = req.body.body;
    addCommentToDb(articleId , username, body)
    .then(comment =>{
    res.status(201).send({ comment });
    })

// .catch(next)
.catch(err =>{
    next(err)})
}

 function changeVotes(req , res , next){
    const articleId = req.params.article_id;
    const voteChange = req.body.inc_votes;

    changeDbVotes(articleId, voteChange)
    .then     //return status or catch error
    (change => {
        res.status(200).send({change})
    })
 }
    

module.exports = {getTopics,getApi,getArticle, getAllArticles, getArticleComments, addComment, changeVotes};

