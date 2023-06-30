const app = require('./app');
const request = require('supertest');
const connection = require('./db/connection')
const seed = require("./db/seeds/seed")
const testData = require("./db/data/test-data")
const endpointsData = require('./endpoints.json');
const comments = require('./db/data/test-data/comments');
require("jest-sorted")


afterAll(()=> connection.end());

beforeEach(()=>{
return seed(testData)
})



describe('api/topics', () => {

    test('Returned should be an object',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            expect(typeof body).toBe('object')
        })
    });
    

    test('200 returns an object containing an array of each entry in the topics table as an object',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
        
        expect(typeof body).toBe('object')
        const { topics } = body;
        expect(topics.length).toBe(3)
           
        topics.forEach((topic)=>{
        expect(typeof topic).toBe('object')
        expect(topic).toHaveProperty('slug');
        expect(topic).toHaveProperty('description')
        })
    });
    })
    
    
})

describe('get /api',()=>{
    test('GET /api should respond with 200 and contents of endpoints.json',()=>{
    return request(app)
    .get('/api')
    .expect(200)
    .then(({body})=>{
    expect(body).toEqual(endpointsData);
    
    })
})
})

    
describe('get /api/articles',()=>{
    test('should return 200 and an array of article objects with the correct properties',()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body})=>{
            const { articles } = body;
            expect(articles.length).toBe(13)
            expect(articles).toBeSorted({"key": "created_at", "descending": true})
            articles.forEach((article)=>{
            expect(article).toHaveProperty('author')
            expect(article).toHaveProperty('title')
            expect(article).toHaveProperty('article_id')
            expect(article).toHaveProperty('topic')
            expect(article).toHaveProperty('created_at')
            expect(article).toHaveProperty('votes')
            expect(article).toHaveProperty('article_img_url')
            expect(article).toHaveProperty('comment_count')
         
            })
        })
    })
})


describe('GET /api/articles/:article_id',()=>{
    test('should respond with 200 and the correct article for the id provided',()=>{
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body})=>{
            expect(typeof body).toBe('object')
            expect(body.article).toHaveProperty('author');
            expect(body.article.author).toBeDefined()
            expect(body.article).toHaveProperty('title');
            expect(body.article.title).toBeDefined()
            expect(body.article).toHaveProperty('article_id');
            expect(body.article.article_id).toBeDefined();
            expect(body.article).toHaveProperty('body');
            expect(body.article.body).toBeDefined();
            expect(body.article).toHaveProperty('topic');
            expect(body.article.topic).toBeDefined()
            expect(body.article).toHaveProperty('created_at');
            expect(body.article.created_at).toBeDefined()
            expect(body.article).toHaveProperty('votes');
            expect(body.article.votes).toBeDefined();
            expect(body.article).toHaveProperty('article_img_url');
            expect(body.article.article_img_url).toBeDefined();
      
        })
        
    })
    test('should respond with a 404 if the provided id is not contained in the DB ',()=>{
        return request(app)
        .get('/api/articles/567')
        .expect(404)
        .then(({body})=>{
    
            expect(body.msg).toBe('Not Found')
    })
})
    
test('should respond with a 400 if the provided id is not valid (eg not a number)',()=>{
    return request(app)
    .get('/api/articles/yo')
    .expect(400)
    .then(({body})=>{
    
        expect(body.msg).toBe('Bad Request')
})
})
})

describe('GET /api/articles/:article_id/comments',()=>{
    test('Should respond with 200 and the correct comments for the article, sorted on ascending order',()=>{
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body})=>{
            const { comments } = body;
            expect(comments).toBeSorted({"key": "created_at", "ascending": true})
            for(let i = 0; i < body.length; i++){
                expect(body.comment).toHaveProperty('comment_id')
                expect(typeof body.comment.comment_id).toBe('number')
                expect(body.comment).toHaveProperty('votes')
                expect(typeof body.comment.votes).toBe('number')
                expect(body.comment).toHaveProperty('created_at')
                expect(typeof body.comment.created_at).toBe('string')
                expect(body.comment).toHaveProperty('author')
                expect(typeof body.comment.author).toBe('string')
                expect(body.comment).toHaveProperty('body')
                expect(typeof body.comment.body).toBe('string')
                expect(body.comment).toHaveProperty('article_id')
                expect(typeof body.comment.ar ).toBe('number')
            }
        })
    })
    test('should respond with a 400 if the provided id is not valid (eg not a number)',()=>{
        return request(app)
        .get('/api/articles/hi/comments')
        .expect(400)
        .then(({body})=>{
        
            expect(body.msg).toBe('Bad Request')
    })
    })

    test('should respond with a 404 if the provided id is not contained in the DB ',()=>{
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body})=>{
    
            expect(body.msg).toBe(`Not Found`)

    })
})
    test('should receive 200 and an empty array for an article with no comments',()=>{
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toEqual([])
        })
    })
})