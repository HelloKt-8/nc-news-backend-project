const request = require("supertest");
const endpointsApp = require("../endpointsApp");
const fs = require("fs");

describe("GET/api", () => {
    test("should respond with JSON object describing all endpoints", () => {
      return fs.promises.readFile("endpoints.json", "utf-8")
        .then(data => {
          const expected = JSON.parse(data);
  
          return request(endpointsApp)
            .get("/api")
            .expect(200)
            .then(response => {
              expect(response.body).toEqual(expected);
            });
        })
        .catch(err => {
          throw err; 
        });
    });
  });
  
