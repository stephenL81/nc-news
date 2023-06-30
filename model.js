const db = require("./db/connection")

function returnTopics(){
    return db.query("SELECT * FROM topics;")
    .then(data => {

        return data.rows
        
    })
}

function returnArticleComments(articleId){
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [articleId])
    .then(({rows})=>{
        if(rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No article found for article_id: ${articleId}`,
              })
        }
        else{
            return db.query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC;" ,[articleId])
            .then(({rows})=>{
                console.log(rows)
                return rows;
            })
        }
        })
    }

function returnArticle(articleId){
    return db.query("SELECT * FROM articles WHERE article_id = $1" ,[articleId])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject(new Error('Not Found'))
        }else{
        return rows;
        }
    })
}

function returnAllArticles(){
    return db.query("SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url,COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC; ")
    .then(data =>{
        return {"articles":data.rows}
    })
}
module.exports = {returnTopics,returnArticle,returnAllArticles,returnArticleComments}