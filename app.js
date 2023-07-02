const express = require('express')
const bodyParser = require('body-parser');


const {getTopics , getApi, getAllArticles, getArticle,getArticleComments,addComment}= require('./controller')


const app = express();

app.use(bodyParser.json());

app.get('/api/topics' , getTopics)

app.get('/api' ,getApi)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id' , getArticle)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', addComment);


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