const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: returns an array of objects on the key of topics with following properties: 'slug' and 'description'", () => {
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
      .get("/api/articles/500")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: return an array of all articles with all the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });

  test("200: returns articles array sorted by date in descending order ", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });

  test("400: Bad Request when sort by query is not valid", () => {
    return request(app)
      .get("/api/articles?sort_by=cheese&order=desc")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Sort Request");
      });
  });

  test("400: Bad Request when order by query is not valid", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=cheese")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid Order Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns an array of all comments for a given article with the correct properties", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });

  test("200: comments should return with the most recent comments first, if article_id has comments", () => {
    return request(app)
      .get("/api/articles/1/comments?sort_by=created_at&order=desc")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body; 
        expect(comments).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });

  test("404: if there article id exists but there are no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("This article has no comments");
      });
  });
  test("400: Bad Request when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
