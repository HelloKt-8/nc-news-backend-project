const { selectArticleById } = require("../models/selectArticleId.models");

exports.getArticlesId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({article}); 
    })
    .catch((err) => {
      next(err);
    });
};
