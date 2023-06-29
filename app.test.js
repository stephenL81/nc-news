const app = require('./app');
const request = require('supertest');
const connection = require('./db/connection')
const seed = require("./db/seeds/seed")
const testData = require("./db/data/test-data")
const endpointsData = require('./endpoints.json')

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

            expect(typeof body).toBe('object')
            const { articles } = body;
            expect(articles.length).toBe(13)
            articles.forEach((article)=>{
            expect(typeof article).toBe('object')
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