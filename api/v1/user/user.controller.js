"use strict";
const _ = require("lodash");
const dbUtils = require("../../../middleware/dbUtils");
const uuid = require("node-uuid");
const randomstring = require("randomstring");
const crypto = require("crypto");
const AppError = require("../../../helpers/app-error");
// const User = require('./user.model');
// const Comment = require('../comment/comment.model');
// const Post = require('../post/post.model');
const {
    create,
    update,
  validateCreate,
  login,
  prepareObject,
  setCookies,
  signToken,
} = require("./user.processor");
const { writeResponse, formatResponse } = require("../../../helpers/response");

const validateRequestBody = require("./user.validation");

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
    const validatePayload = await validateCreate(transaction, obj);
    if (validatePayload) {
      throw new AppError(validatePayload.message, validatePayload.status);
    }
    //create the user
    let newUser = await create(transaction, obj);
    const tokentPayload = _.pick(newUser, ["email", "id"]);
    const token = await signToken(tokentPayload);
    Object.assign(newUser, { token });
    setCookies(req, res, token);
    newUser = await formatResponse(newUser);
    await transaction.commit();
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
      "MATCH (user:User {id:$id}) RETURN user",
      {
        id: req.params.id,
      }
    );
    if(dbUser.records.length <= 0){
        throw new AppError('Record Not Found', 404)
    }
    req.object = dbUser.records[0].get("user").properties;
    await transaction.commit();
    next();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
exports.findOne = async (req, res, next) => {
    let obj = _.omit(req.object, [ 'password', 'api_key'])
    writeResponse(res, obj, 200);
};
  
exports.login = async (req, res, next) => {
  let session = null,
    transaction = null;
  try {
    session = dbUtils.getSession(req);
    transaction = session.beginTransaction();
    // validate here
    const isValid = await validateRequestBody.login(req.body);
    if (!isValid.passed) {
      throw new AppError(null, 401, isValid.errors);
    }
    const obj = prepareCreateObject(req);
    let dbUser = await login(transaction, obj);
    if (!dbUser) {
      throw new AppError("Invalid Login Credentials (Email / Password)", 400);
    }
    const tokentPayload = _.pick(dbUser, ["email", "id"]);
    const token = await signToken(tokentPayload);
    Object.assign(dbUser, { token });
    await transaction.commit();
    setCookies(req, res, token);
    dbUser = await formatResponse(dbUser);
    writeResponse(res, dbUser, 200);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
exports.find = async (req, res, next) => {
  let session = null,
    transaction = null;
  try {
    session = dbUtils.getSession(req);
    transaction = session.beginTransaction();
    let dbUser = await transaction.run(
      "MATCH (user:User) RETURN user ORDER BY user.email"
    );
    await transaction.commit();
    dbUser = await formatResponse(dbUser);
    writeResponse(res, dbUser, 200);
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
      const obj = prepareObject(req, ['password']);
      const validatePayload = await validateCreate(transaction, obj, object.id);
      if (validatePayload) {
        throw new AppError(validatePayload.message, validatePayload.status);
      }
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
      const obj = prepareObject(req, ['password']);
      Object.assign(object, obj)
      const validatePayload = await validateCreate(transaction, object, object.id);
      if (validatePayload) {
        throw new AppError(validatePayload.message, validatePayload.status);
      }
      let newUser = await update(transaction, object);
      await transaction.commit();
      newUser = await formatResponse(newUser);
      writeResponse(res, newUser, 201);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
};
exports.testGet = async (req, res, next) => {
  // next('hello erro', 201)
  next(new AppError("hello erro", 201));
  // try {
  //     throw {username: 'username already in use', status: 401}
  // } catch (error) {
  //     next(error)
  // }
};
