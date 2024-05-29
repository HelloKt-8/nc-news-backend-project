const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const express = require("express");

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

  test("400: returns 'not found' when api topics endpoint is invalid due to typo or different endpoint received", () => {
    return request(app)
      .get("/api/tpics")
      .expect(404)
      .then(({body}) => expect(body.msg)
      .toBe("Not Found"));
  });
});
