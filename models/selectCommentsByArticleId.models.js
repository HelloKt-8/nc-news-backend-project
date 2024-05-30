const db = require("../db/connection");

exports.selectCommentsByArticleId = (
  article_id,
  sort_by = "created_at",
  order = "desc"
) => {
  const validSortBy = ["created_at"];
  const validOrderBy = ["asc", "desc", "ASC", "DESC"];

  if (sort_by && !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Request" });
  }

  if (sort_by && !validOrderBy.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order Request" });
  }

  const queryValues = [];
  let sqlQuery = `SELECT * FROM COMMENTS`;

  if (article_id) {
    sqlQuery += " WHERE article_id = $1";
    queryValues.push(article_id);
  }

  if (sort_by) {
    sqlQuery += ` ORDER BY ${sort_by} ${order}`;
  }

  sqlQuery += ";";
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "This article has no comments",
      });
    };
    return rows;
  });
};
