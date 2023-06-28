const db = require("./db/connection")

function returnTopics(){
    return db.query("SELECT * FROM topics;")
    .then(data => {

        return data.rows
        
    })
}

function returnArticle(){
    return db.query("SELECT * FROM articles WHERE article_id = $1" ,[article_id]) // do I need RETURNING?
    .then(data => {
        console.log (data);
    })
}

module.exports = {returnTopics,returnArticle}