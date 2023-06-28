const db = require("./db/connection")

function returnTopics(){
    return db.query("SELECT * FROM topics;")
    .then(data => {

        return data.rows
        
    })
}

function returnArticle(articleId){
    return db.query("SELECT * FROM articles WHERE article_id = $1" ,[articleId])
    .then(({rows}) => {
        return rows;
    })
}

module.exports = {returnTopics,returnArticle}