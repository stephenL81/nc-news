const app = require('./app');
const request = require('supertest');
const connection = require('./db/connection')
const seed = require("./db/seeds/seed")
const testData = require("./db/data/test-data")

afterAll(()=> connection.end());

beforeEach(()=>{
return seed(testData)
})

describe('api/topics', () => {
    test('returns an array of each entry in the topics table as an object',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=>{
            const{ rows } = body;
            rows.forEach((row)=>{
        expect(row).toHaveProperty('slug');
        expect(row).toHaveProperty('description')
        })
    });
    
})
    
})
