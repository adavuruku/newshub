// var dbUtils = require('./dbUtils');
const jwt = require('jsonwebtoken');
const AppError = require('../helpers/app-error');
const config = require('../config')

function setAuthUser (req, res, next) {
  // console.log(req.headers.cookie)
  const token = req.cookies['x-access-token'] || req.headers['x-access-token']
  if (!token) {
    req.userId = null
    req.email = null
    const appError =  new AppError('No Authorization Provided', 401);
    next(appError)
  }
  else {
    jwt.verify(token, config.get('superSecret'), async(error, decoded)=>{
      if(error){
        let message = 'Invalid token'
        if(error.name ==='TokenExpiredError'){
          message =`${message} :: Please login to continue`
        }else{
          message =`${message} :: Failed to authenticated token`
        }
        const appError =  new AppError(message, 401);
        next(appError)
      }else{
        req.userId = decoded.id
        req.email = decoded.email
        next()
      }
    })
  }
};
module.exports = setAuthUser