const express = require('express')


const {getTopics , getApi, getAllArticles, getArticle,getArticleComments}= require('./controller')


const app = express();

app.get('/api/topics' , getTopics)

app.get('/api' ,getApi)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id' , getArticle)

app.get('/api/articles/:article_id/comments', getArticleComments)




app.use((err, req, res, next)=>{
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })}
        else{next(err)}
})

app.use((err, req, res,next)=>{
    if(err.code === '22P02'){
        res.status(400).send({msg: 'Invalid input'})
    }else next(err)
})

app.use((err , req, res, next)=>{
    res.status(500).send('Server Error');
})

module.exports = app