const db = require("../db/connection");

exports.selectArticles = (sort_by = "created_at", order = "desc") => {
  const validSortBy = ["created_at"];
  const validOrderBy = ["asc", "desc", "ASC", "DESC"];

  if (sort_by && !validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Request" });
  }

  if (!validOrderBy.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Order Request" });
  }

  let sqlQuery = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id`;

  if (sort_by) {
    sqlQuery += ` ORDER BY ${sort_by} ${order}`;
  }

  sqlQuery += ";";

  return db.query(sqlQuery).then(({ rows }) => {
    //console.log(rows);
    return rows;
  });
};
