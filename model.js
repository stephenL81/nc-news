const db = require("./db/connection")

function returnTopics(){
    return db.query("SELECT * FROM topics;")
    .then(data => {
        return data
    })
}

module.exports = returnTopics