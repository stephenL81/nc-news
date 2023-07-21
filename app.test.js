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
    
    test('should respond with a 404 if the provided id is not contained in the DB ',()=>{
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body})=>{
            
            expect(body.msg).toBe(`Not Found`)
            
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

    test('should receive 200 and an empty array for an article with no comments',()=>{
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body})=>{
            expect(body.comments).toEqual([])
        })
    })
})

describe('POST /api/articles/:article_id/comments',()=>{
    test.skip('should add a comment for article', () => {
        request(app)
          .post('/api/articles/1/comments')
          .send({ "username": 'lurker', "body": 'Good effort!' })
          .expect(201)
      .then(response => {
        console.log(response.rows)
            const comment = response.body.comment;
            expect(comment).toBeDefined();
            expect(comment.article_id).toBe(1);
            expect(comment.author).toBe('lurker');
            expect(comment.body).toBe('Good effort!');
        })
          });
      });
      
      test('should give a 400 when the request is missing a required field', () => {
        request(app)
            .post('/api/articles/2/comments')
            .send({ "body": "not bad" })
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('Required fields not provided')
            

    });

      
})


describe('PATCH /api/articles/:article_id',()=>{
    test('should return 200 and the post when successful', async () =>{
        const response = await request(app)
        .patch('/api/articles/2')
        .send({ inc_votes : 10})
        .expect(200)

            expect(response.body).toBeDefined();
            expect(response.body.data.title).toBe('Sony Vaio; or, The Laptop');
            expect(response.body.data.article_id).toBe(2);
            expect(response.body.data.votes).toBe(10);
        })
    })
    
    test('should return 200 and the post with correct votes when inc_votes is negative', async () =>{
        const response = await request(app)
        .patch('/api/articles/1')
        .send({ inc_votes : -5})
        .expect(200)
            expect(response.body).toBeDefined();
            expect(response.body.data.title).toBe('Living in the shadow of a great man');
            expect(response.body.data.article_id).toBe(1);
            expect(response.body.data.votes).toBe(95);
        })
    
        test('should return 404 when article_id does not exist', async () => {
            await request(app)
              .patch('/api/articles/999')
              .send({ inc_votes: 10 })
              .expect(404);
          });

          test('should return 400 when article_id is not a number', async () => {
            await request(app)
              .patch('/api/articles/banana')
              .send({ inc_votes: 10 })
              .expect(400);
          });

          test('should return 400 when inc_votes is missing', async () => {
            await request(app)
              .patch('/api/articles/2')
              .send({})
              .expect(400);
          });

          describe('DELETE /api/articles/:article_id', () => {
            test('should delete the specified article and respond with 204', () => {
                return request(app)
                .delete('/api/comments/1')
                .then((response) => {
                 expect(response.status).toBe(204);
          
                  return request(app).get('/api/comments/1')
                  .then((response) =>{
                    expect(response.status).toBe(404);
                  })
                  
                });
            });
          
            test('should return 404 if the article does not exist', () => {
              return request(app)
              .delete('/api/articles/999')
              .expect(404);
            });
          
            test.skip('should return 400 if the article ID is not valid', () => {
              return request(app)
              .delete('/api/articles/something')
              .expect(400);
            });
          });
              //})

