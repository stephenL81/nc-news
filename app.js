const express = require('express')
const getTopics = require('./controller')

const app = express();
app.get('/api/topics' , getTopics)

app.use((err, req, res, next)=>{
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })};
})

app.use((err , req, res, next)=>{
    res.status(500).send('Server Error');
})

module.exports = app