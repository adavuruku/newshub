"use strict"
const _ = require('lodash');
const config = require('../../../config');
const {hashPassword} = require('../../../helpers/appUtils');
const uuid = require('node-uuid');
const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const randomstring = require("randomstring");
const md5 = require('md5');
const AppError = require('../../../helpers/app-error');
const User = require('./user.model')

exports.prepareObject = (req, removeFromObject= []) => {
    let obj = Object.assign({}, req.body, req.params)
    if(removeFromObject.length > 0){
        obj = _.omit(obj, removeFromObject)
    }
    if(req.userId){
        const user = req.userId;
        Object.assign(obj, {user})
    }
    return obj
}
exports.validateCreate = async(session, obj, currentId = "") => {
    try {
        const query = [
            'MATCH (user:User)',
            'where user.email = $email AND user.id <> $current',
            'RETURN user LIMIT 1'
          ].join('\n');
        const userExist = await session.run(query, {email: obj.email, current:currentId})
        if (!_.isEmpty(userExist.records)) {
            return {message: `The Email ${obj.email} is already in use`, status: 400}
        }
        return null
    } catch (error) {
        throw new AppError(`Server Error: ${error}`,500)
    }
}
exports.create = async (session, obj) => {
    try {
        const userExist =  await session.run('CREATE (user:User {id: $id, email: $email, password: $password, api_key: $api_key, firstName:$firstName, lastName:$lastName, avatar:$avatar, deleted:false}) RETURN user',
        {
            id: uuid.v4(),
            email: obj.email,
            password: hashPassword(obj.password),
            firstName: obj.firstName,
            lastName: obj.lastName,
            avatar: `https://www.gravatar.com/avatar/${md5(obj.email)}?d=robohash`,
            api_key: randomstring.generate({
              length: 20,
              charset: 'hex'
            })
        }
      );
      return _.get(userExist.records[0].get('user'), 'properties');
    } catch (error) {
        throw new AppError(`Server Error: ${error}`,500)
    }
};

exports.update = async (session, obj) => {
    try {
        let query = [
            'MATCH (user:User {id: $id})',
            'SET user.email = $email, user.firstName = $firstName, user.lastName = $lastName , user.avatar = $avatar',
            'RETURN user'
        ].join('\n')
        return await session.run(query,
        {
            id:obj.id,
            email: obj.email,
            firstName: obj.firstName,
            avatar: obj.avatar,
            lastName: obj.lastName
        }
      );
    } catch (error) {
        throw new AppError(`Server Error: ${error}`,500)
    }
};
exports.login = async(session, obj) => {
    try {
        const userExist = await session.run('MATCH (user:User {email: $email, deleted:false}) RETURN user LIMIT 1', {email: obj.email})
        if (!_.isEmpty(userExist.records)) {
            let dbUser = _.get(userExist.records[0].get('user'), 'properties');
            if (dbUser.password === hashPassword(obj.password)) {
                dbUser = _.omit(dbUser, ['password'])
                return dbUser
            }
        }
        return null
    } catch (error) {
        throw new AppError(`Server Error: ${error}`,500)
    }
}

exports.changePassword = async(session, obj) => {
    try {
        let userExist = await session.run('MATCH (user:User {id: $id, deleted:false}) RETURN user LIMIT 1', {id: obj.user})
        if (!_.isEmpty(userExist.records)) {
            let dbUser = _.get(userExist.records[0].get('user'), 'properties');
            if (dbUser.password === hashPassword(obj.oldPassword)) {
                userExist = await session.run('MATCH (user:User {id: $id, deleted:false}) set user.password = $password RETURN user LIMIT 1', {id: dbUser.id, password: hashPassword(obj.newPassword)})
                dbUser = _.omit(dbUser, ['password'])
                return dbUser
            }
        }
        return null
    } catch (error) {
        throw new AppError(`Server Error: ${error}`,500)
    }
}

exports.setCookies = (req, res, token) => {
    res.setHeader(
        'Set-Cookie',
        cookie.serialize('x-access-token', token, {
            httpOnly: false,
            // secure: true,
            sameSite: 'none',
            maxAge: config.get('token_expires'),
            path: '/',
            domain: req.get('origin')
        })
    );
}
exports.signToken = async(tokentPayload) =>{
    const obj = {...tokentPayload};
    return await jwt.sign(obj, config.get('superSecret'), {
        expiresIn: config.get('token_expires')
    });
}