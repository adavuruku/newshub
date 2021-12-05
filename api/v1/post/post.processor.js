"use strict"
const _ = require('lodash');
const config = require('../../../config');
const uuid = require('node-uuid');
const AppError = require('../../../helpers/app-error');
const Post = require('./post.model')

exports.create = async (session, obj) => {
    try {
        let query = [
            'MATCH (user:User {id:$userId})',
            'CREATE (post:Post {id: $id, title: $title, body: $body, createdAt: datetime(), deleted:false})',
            'CREATE (user)-[user_post:CREATE_POST]->(post)',
            'CREATE (post)-[post_user:CREATED_BY]->(user)',
            'RETURN post'
        ].join('\n')
        const userExist =  await session.run(query,
        {
            id: uuid.v4(),
            title: obj.title,
            body: obj.body,
            userId:obj.user
        }
      );
      return _.get(userExist.records[0].get('post'), 'properties');
    } catch (error) {
        throw new AppError(`Server Error: ${error}`,500)
    }
};

exports.update = async (session, obj) => {
    try {
        let query = [
            'MATCH (post:Post {id: $id})',
            'SET post.title = $title, post.body = $body',
            'RETURN post'
        ].join('\n')
        return await session.run(query,
        {
            id:obj.id,
            title: obj.title,
            body: obj.body
        }
      );
    } catch (error) {
        throw new AppError(`Server Error: ${error}`,500)
    }
};