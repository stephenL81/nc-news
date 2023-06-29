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
    test('should return an array of article objects with the correct properties',()=>{
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body})=>{
            expect(body[0]).toHaveProperty('author')
            expect(body[0]).toHaveProperty('title')
            expect(body[0]).toHaveProperty('article_id')
            expect(body[0]).toHaveProperty('topic')
            expect(body[0]).toHaveProperty('created_at')
            expect(body[0]).toHaveProperty('votes')
            expect(body[0]).toHaveProperty('article_img_url')
            expect(body[0]).toHaveProperty('comment_count')
        })
    })
})