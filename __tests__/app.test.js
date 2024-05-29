const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: returns an array objects on the key of topics with following properties: 'slug' and 'description'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });

  test("404: returns 'not found' when api topics endpoint is invalid due to typo or different endpoint received", () => {
    return request(app)
      .get("/api/tpics")
      .expect(404)
      .then(({ body }) => expect(body.msg).toBe("Not Found"));
  });
});

describe("GET /api/articles/:article_id", () => {
    test("200: return an article object with the correct properties based on the article id", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            });
          });
      });
    

  test("404: Not Found when an id is valid but does not exist", () => {
    return request(app)
    .get('/api/articles/500')
    .expect(404)
    .then((response) => {
        expect(response.body.msg).toBe("Not Found")
    })
  })
});
