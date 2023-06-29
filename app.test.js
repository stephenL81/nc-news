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
