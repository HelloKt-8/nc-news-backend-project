const express = require("express");
const endpointsApp = express();
const fs = require("fs");

endpointsApp.get("/api", (req, res) => {
  fs.readFile('endpoints.json', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    try {
      const parseEndpoints = JSON.parse(data);
      res.status(200).send(parseEndpoints);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

module.exports = endpointsApp;
