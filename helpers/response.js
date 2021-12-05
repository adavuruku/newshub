var _ = require("lodash");

exports.formatResponse = async (resultObj) => {
    if(_.isArray(resultObj.records)){
      if (resultObj.records.length > 0) {
        return resultObj.records.map(record => {
          let res =  {
            ...record._fields[0].properties
          }
          return _.omit(res, ['password', 'api_key'])
        });
      }else{
        return []
      }
    }else{
      return _.omit(resultObj, ['password', 'api_key'])
    }
    // if (resultObj.records.length > 0) {
      
    //   return result;
    // }else{
      
    // }
   
}


  
exports.writeResponse = function writeResponse(res, response, status) {
  // sw.setHeaders(res);
  // res.status(status || 200).send(JSON.stringify(response));
  let meta ={
    status_code:status,
    success:true
  }
  let clientResponse = Object.assign({}, {meta}, {data:response})
  res.status(status || 200).json(clientResponse);
};

exports.writeError = function writeError(res, error, status) {
  // sw.setHeaders(res);
  console.log(error)
  res
    .status(error.status || status || 400)
    // .send(JSON.stringify(_.omit(error, ["status"])));
    .json(_.omit(error, ["status"]));

};
