const {selectArticles} = require("../models/selectArticles.models")


exports.getArticles = (req, res, next) => {
    const {sort_by, order} =req.query
  selectArticles(sort_by, order).then((articles) => {
    res.status(200).send({ articles });
  }).catch((err) => {next(err)});
};
