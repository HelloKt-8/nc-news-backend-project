const {
  selectCommentsByArticleId,
} = require("../models/selectCommentsByArticleId.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const {sort_by, order} = req.query
  selectCommentsByArticleId(article_id, sort_by, order)
    .then((comments) => {
      res.status(200).send({comments});
    })
    .catch((err) => {
      next(err);
    });
};
