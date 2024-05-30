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

exports.patchArticleVotesById = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles 
     SET votes = votes + $1
     WHERE article_id = $2
     RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article Id does not exist",
        });
      }
      return data.rows[0];
    });
};

exports.createComment = (article_id, newComment) => {
  const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3)`,
      [username, username, "placeholder"]
    )
    .then(() => {
      return db.query(
        `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`,
        [body, article_id, username]
      );
    })
    .then((data) => {
      return data.rows[0];
    })
};
