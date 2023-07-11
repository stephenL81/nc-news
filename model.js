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
                msg: `Not Found`,
              })
        }
        else{
            return db.query("SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC;" ,[articleId])
            .then(({rows})=>{
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

function addCommentToDb(articleId ,username, body){
    if (!username || !body) return Promise.reject({ status: 400, msg: "Required fields not provided"});
    console.log('result')
    return db.query(`INSERT INTO comments(article_id, author, body) VALUES ($1, $2, $3)  RETURNING *`, [articleId, username , body])
    .then(result => {
    return result.rows[0]
    })
    .catch(err =>{
        console.log(err)
        throw err;
    })

}
    

function changeDbVotes(articleId , voteChange){
if(!articleId || !voteChange) return Promise.reject({ status: 400, msg: "Required fields not provided"});
return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2`, [voteChange, articleId])
.then(result =>{
    if(result.rows.length === 0){
        return Promise.reject({
            status: 404,
            msg: `Not Found`,
    })}
    console.log(result)
    return result.rows[0]
})
}
module.exports = {returnTopics,returnArticle,returnAllArticles,returnArticleComments,addCommentToDb,changeDbVotes}

//UPDATE Customers
//SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
//WHERE CustomerID = 1;