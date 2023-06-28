const returnTopics = require("./model")
const fs = require('fs')
const data = require('./endpoints.json')

function getTopics(req, res, next){
    
returnTopics()
.then(data => {
    
    res.status(200).send({'topics': data})
})
.catch(next)
}


function getApi(req, res){
    res.status(200).send(data)
}



module.exports = {getTopics,getApi};