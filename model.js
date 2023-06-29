const db = require("./db/connection")

function returnTopics(){
    return db.query("SELECT * FROM topics;")
    .then(data => {

        return data.rows
        
    })
}

function returnArticle(){
    return db.query("SELECT * FROM articles WHERE article_id = $1" ,[article_id]) 
    .then(data => {
        console.log (data);
    })
}

function returnArticles(){
    return db.query("SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url,COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id,articles.title,articles.topic,articles.author, articles.created_at,articles.votes,articles.article_img_url ORDER BY articles.created_at DESC; ")
    .then(data =>{
        return {"articles":data.rows}
    })
}
module.exports = {returnTopics,returnArticle,returnArticles}