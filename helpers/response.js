var _ = require("lodash");

exports.formatResponse = (resultObj) => {
    const result = [];
    if (resultObj.records.length > 0) {
      resultObj.records.map(record => {
        result.push(record._fields[0].properties);
      });
    }
    return result;
  }


  
exports.writeResponse = function writeResponse(res, response, status) {
  // sw.setHeaders(res);
  res.status(status || 200).send(JSON.stringify(response));
};

exports.writeError = function writeError(res, error, status) {
  // sw.setHeaders(res);
  res
    .status(error.status || status || 400)
    .send(JSON.stringify(_.omit(error, ["status"])));
};
