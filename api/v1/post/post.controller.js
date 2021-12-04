const _ = require('lodash');
const Post = require('./post.model');

const getAll = function(session) {
  return session.readTransaction(txc =>
      txc.run('MATCH (post:Post) RETURN post')
    ).then(_manyGenres);
};

const _manyGenres = function (result) {
  return result.records.map(r => new Post(r.get('post')));
};

module.exports = {
  getAll: getAll
};