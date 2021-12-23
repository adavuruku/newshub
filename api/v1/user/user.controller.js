"use strict";
const _ = require("lodash");
const dbUtils = require("../../../middleware/dbUtils");
const AppError = require("../../../helpers/app-error");
const {prepPagination} = require("../../../helpers/population");

// const User = require('./user.model');
const {
    create,
    update,
    changePassword,
  validateCreate,
  login,
  prepareObject,
  setCookies,
  signToken,
} = require("./user.processor");
const { writeResponse, formatResponse } = require("../../../helpers/response");

const validateRequestBody = require("./user.validation");
const mainTable = 'user'
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
      "MATCH (user:User {id:$id, deleted:false}) RETURN user limit 1",
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
    let obj = formatResponse(_.omit(req.object, [ 'password', 'api_key']))
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
    const obj = prepareObject(req);
    let dbUser = await login(transaction, obj);
    if (!dbUser) {
      throw new AppError("Invalid Login Credentials (Email / Password)", 400);
    }
    const tokentPayload = _.pick(dbUser, ["email", "id"]);
    const token = await signToken(tokentPayload);
    Object.assign(dbUser, { token });
    setCookies(req, res, token);
    dbUser = await formatResponse(dbUser);
    await transaction.commit();
    writeResponse(res, dbUser, 200);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
exports.updatePassword = async (req, res, next) => {
  let session = null,
    transaction = null;
  try {
    session = dbUtils.getSession(req);
    transaction = session.beginTransaction();
    // validate here
    const isValid = await validateRequestBody.changePassword(req.body);
    if (!isValid.passed) {
      throw new AppError(null, 401, isValid.errors);
    }
    const obj = prepareObject(req);
    let dbUser = await changePassword(transaction, obj);
    if (!dbUser) {
      throw new AppError("Enter your previous Password", 400);
    }
    dbUser = await formatResponse(dbUser);
    await transaction.commit();
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
    dbUser = await formatResponse(dbUser);
    await transaction.commit();
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
      newUser = await formatResponse(newUser);
      await transaction.commit();
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
      newUser = await formatResponse(newUser);
      await transaction.commit();
      writeResponse(res, newUser, 201);
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
      'MATCH (user:Post {id:$userId})',
      'set deleted = true'
    ].join('\n');
    await transaction.run(query,{userId:req.userId});
    await transaction.commit();
    writeResponse(res, {message:'User Account Deleted'}, 200);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

exports.findUserPopulation = async (req, res, next) => {
  let session = null,
    transaction = null;
  try {
    let san = {}
    Object.assign(san, req.query)
    Object.assign(san, req.params)
    console.log('req.query', req.query)
    console.log('req.params', req.params)
    let population = []
    if(san.population){
      population = JSON.parse(san.population)
      delete san.population
    }
    session = dbUtils.getSession(req);
    transaction = session.beginTransaction();
    console.log(mainTable, san, population)
    let resReturn = await prepPagination(mainTable, san, population, transaction) 
    let dbUser = await formatResponse(resReturn);
    await transaction.commit();
    // session = dbUtils.getSession(req);
    // transaction = session.beginTransaction();
    // let dbUser = await transaction.run(
    //   "MATCH (user:User) RETURN user ORDER BY user.email"
    // );
    // dbUser = await formatResponse(dbUser);
    // await transaction.commit();
    
    writeResponse(res, dbUser, 200);
  } catch (error) {
    // await transaction.rollback();
    next(error);
  }
};
