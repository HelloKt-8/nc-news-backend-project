const request = require("supertest");
const endpointsApp = require("../endpointsApp");
const fs = require("fs");
const path = require("path");

describe("GET/api", () => {
  test("should respond with JSON object describing all endpoints", () => {
    fs.readFile("endpoints.json", "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
      const expected = JSON.parse(data);
      return request(endpointsApp)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(expected);
        });
    });
  });
});
