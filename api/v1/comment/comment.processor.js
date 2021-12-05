"use strict"
const _ = require('lodash');
const config = require('../../../config');
const uuid = require('node-uuid');
const AppError = require('../../../helpers/app-error');
const Comment = require('./comment.model')

exports.create = async (session, obj) => {
    try {
        let query = [
            'MATCH (post:Post {id:$postId})',
            'MATCH (user:User {id:$userId})',
            'CREATE (comment:Comment {id: $id,body: $body, createdAt: datetime(), deleted:false})',
            'CREATE (comment)-[comment_user:CREATED_BY]->(user)',
            'CREATE (post)-[comments:COMMENTS]->(comment)',
            'RETURN comment'
        ].join('\n')
        const userExist =  await session.run(query,
        {
            id: uuid.v4(),
            body: obj.body,
            postId:obj.post,
            userId:obj.user
        }
      );
      return _.get(userExist.records[0].get('comment'), 'properties');
    } catch (error) {
        throw new AppError(`Server Error: ${error}`,500)
    }
};

exports.update = async (session, obj) => {
    try {
        let query = [
            'MATCH (comment:Comment {id: $id})',
            'SET comment.body = $body',
            'RETURN comment'
        ].join('\n')
        return await session.run(query,
        {
            id:obj.id,
            body: obj.body
        }
      );
    } catch (error) {
        throw new AppError(`Server Error: ${error}`,500)
    }
};