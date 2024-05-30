const express = require("express");
const { getTopics } = require("./controllers/getTopics.controllers");
const { getArticlesId } = require("./controllers/getArticlesId.controllers");
const {getArticles, patchArticleVotes} = require("./controllers/getArticles.controllers");
const {getCommentsByArticleId} = require("./controllers/getCommentsByArticleId.controllers")
const {deleteComment} = require("./controllers/deleteComments.controllers")
const app = express();
app.use(express.json());


app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesId);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.patch("/api/articles/:article_id", patchArticleVotes);
app.delete("/api/comments/:comment_id", deleteComment)


app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err)
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
