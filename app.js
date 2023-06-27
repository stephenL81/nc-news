const express = require('express')
const {getTopics , getApi}= require('./controller')

const app = express();

app.get('/api/topics' , getTopics)

app.get('/api' ,getApi)

// app.get('/api',(req, res)=>{
//     res.status(200).send(data)
// })





app.use((err, req, res, next)=>{
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })};
})

app.use((err , req, res, next)=>{
    res.status(500).send('Server Error');
})

module.exports = app