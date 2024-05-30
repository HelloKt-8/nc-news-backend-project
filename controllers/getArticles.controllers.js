const {
  selectArticles,
  patchArticleVotesById,
  createComment,
} = require("../models/selectArticles.models");

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  selectArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  patchArticleVotesById(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).json({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  createComment(article_id, newComment)
    .then((NewcommentDetails) => {
      res.status(201).send({ comment: NewcommentDetails });
    })
    .catch((err) => {
      next(err);
    });
};
