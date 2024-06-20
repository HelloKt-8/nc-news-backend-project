const {
  selectArticles,
  patchArticleVotesById,
  createComment,
  fetchArticleById,
  fetchUserByUsername
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

  console.log("RECEIVING NEW COMMENT CONTROLLERS", newComment);
  console.log(newComment.username)

  fetchArticleById(article_id)
    .then((article) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return createComment(article_id, newComment)
      // fetchUserByUsername(newComment.username);
    })
    // .then((user) => {
    //   if (!user) {
    //     return Promise.reject({ status: 404, msg: 'User not found' });
    //   }
    //   return createComment(article_id, newComment);
    // })
    .then((NewcommentDetails) => {
      console.log(NewcommentDetails, ">>FROM API TO CONTROLLERS")
      res.status(201).send({ comment: NewcommentDetails });
    })
    .catch((err) => {
      console.log(err, "<<<<<")
      next(err);
    });
};
