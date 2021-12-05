"use strict";
const _ = require("lodash");
const dbUtils = require("../../../middleware/dbUtils");
const AppError = require("../../../helpers/app-error");
// const Post = require('../post/post.model');
const {
    create, update
} = require("./comment.processor");

const {
  prepareObject,
} = require("../user/user.processor");
const { writeResponse, formatResponse } = require("../../../helpers/response");

const validateRequestBody = require("./comment.validation");

exports.create = async (req, res, next) => {
  let session = null,
    transaction = null;
  try {
    session = dbUtils.getSession(req);
    transaction = session.beginTransaction();
    // validate here
    const isValid = await validateRequestBody.create(req.body);
    if (!isValid.passed) {
      throw new AppError('Fail Validation', 401, isValid.errors);
    }
    const obj = prepareObject(req);
    let newUser = await create(transaction, obj);
    newUser = await formatResponse(newUser);
    await transaction.commit();
    writeResponse(res, newUser, 201);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
exports.update = async (req, res, next) => {
    let session = null,
      transaction = null;
    try {
      session = dbUtils.getSession(req);
      transaction = session.beginTransaction();
      // validate here
      const isValid = await validateRequestBody.update(req.body);
      if (!isValid.passed) {
        throw new AppError(null, 401, isValid.errors);
      }
      const object = req.object
      const obj = prepareObject(req);
      //update the user
      Object.assign(object, obj)
      let newUser = await update(transaction, object);
      await transaction.commit();
      newUser = await formatResponse(newUser);
      writeResponse(res, newUser, 201);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
};
exports.patch = async (req, res, next) => {
    let session = null,
      transaction = null;
    try {
      session = dbUtils.getSession(req);
      transaction = session.beginTransaction();
      // validate here
      const isValid = await validateRequestBody.patch(req.body);
      if (!isValid.passed) {
        throw new AppError(null, 401, isValid.errors);
      }
      const object = req.object
      const obj = prepareObject(req);
      Object.assign(object, obj)
      let newUser = await update(transaction, object);
      await transaction.commit();
      newUser = await formatResponse(newUser);
      writeResponse(res, newUser, 201);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
};
exports.id = async (req, res, next) => {
  let session = null,
    transaction = null;
  try {
    session = dbUtils.getSession(req);
    transaction = session.beginTransaction();
    let dbUser = await transaction.run(
      "MATCH (comment:Comment {id:$id, deleted:false}) RETURN comment limit 1",
      {
        id: req.params.id,
      }
    );
    if(dbUser.records.length <= 0){
        throw new AppError('Record Not Found', 404)
    }
    req.object = dbUser.records[0].get("comment").properties;
    
    await transaction.commit();
    next();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
exports.findOne = async (req, res, next) => {
    let session = null,
    transaction = null;
  try {
    session = dbUtils.getSession(req);
    transaction = session.beginTransaction();
    const query = [
      'MATCH (comment:Comment {id:$id})-[:CREATED_BY]->(user:User)',
      `RETURN comment,user limit 1`
    ].join('\n');
    let obj = await transaction.run(query,{id:req.object.id});
    obj = await formatResponse(obj)
    await transaction.commit();
    writeResponse(res, obj, 200);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  let session = null,
    transaction = null;
  try {
    session = dbUtils.getSession(req);
    transaction = session.beginTransaction();
    const query = [
      'MATCH (comment:Comment {id:$id})-[:CREATED_BY]->(user:User {id:$userId})',
      'set comment.deleted = true'
    ].join('\n');
    await transaction.run(query,{id:req.object.id, userId:req.userId});
    await transaction.commit();
    writeResponse(res, {message:'Comment Deleted'}, 200);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
  
// exports.find = async (req, res, next) => {
//   let session = null,
//     transaction = null;
//   try {
//     session = dbUtils.getSession(req);
//     transaction = session.beginTransaction();
//     let page = req.query.page? req.query.page : 1
//     let limit = 10
//     const offset = (page - 1) * limit
//     const query = [
//         'MATCH (post:Post {deleted:false})-[:COMMENTS]->(comment:Comment {deleted:false})-[:CREATED_BY]->(user:User)',
//         `RETURN post,comment,user ORDER BY post.dateCreated DESC skip ${offset} limit ${limit}`
//       ].join('\n');
//     let dbUser = await transaction.run(query,{
//       id:req.userId
//     });
//     dbUser = await formatResponse(dbUser);
//     await transaction.commit();
//     writeResponse(res, dbUser, 200);
//   } catch (error) {
//     await transaction.rollback();
//     next(error);
//   }
// };

exports.find = async (req, res, next) => {
  let session = null,
    transaction = null;
  try {
    session = dbUtils.getSession(req);
    transaction = session.beginTransaction();
    let page = req.params.page? req.params.page : 1
    let limit = 10
    const offset = (page - 1) * limit
    const query = [
      'MATCH (post:Post {deleted:false, id:$id})-[:COMMENTS]->(comment:Comment {deleted:false})-[:CREATED_BY]->(user:User)',
      `RETURN comment, user ORDER BY post.dateCreated skip ${offset} limit ${limit}`
    ].join('\n');
    let dbUser = await transaction.run(query,{
        id:req.params.post
    });
    dbUser = await formatResponse(dbUser);
    await transaction.commit();
    writeResponse(res, dbUser, 200);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};