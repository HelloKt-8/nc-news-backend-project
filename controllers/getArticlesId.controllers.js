const { selectArticleById } = require("../models/selectArticleId.models");

exports.getArticlesId = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id).then((articles) => {
    res.status(200).send({ articles });
  }).catch((err) => {
    next(err)
  });
};

