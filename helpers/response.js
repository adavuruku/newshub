var _ = require("lodash");

function manyMovies(neo4jResult) {
  // return neo4jResult.records.map(r => new Movie(r.get('movie')))
  return neo4jResult.records.map(r =>r.get('movie'))
}

let formatDateLength = (value) => value < 10 ? `0${value}` : value
let formatDate = (givenDate) => {
  return `${formatDateLength(givenDate.year.low)}-${formatDateLength(givenDate.month.low)}-${formatDateLength(givenDate.day.low)} ${formatDateLength(givenDate.hour.low)}:${formatDateLength(givenDate.minute.low)}:${formatDateLength(givenDate.second.low)}` 
}
exports.formatResponse = async (resultObj) => {
  let cleandObject = ['password', 'api_key', 'deleted','active']
  let finalResult = []
    if(_.isArray(resultObj.records)){
      let allrecs = resultObj.records.length
      if (allrecs > 0) {
        for(let i = 0; i < allrecs; i++){
          let obj = {}
          let record = resultObj.records[i]
          for(let y=0 ; y < record._fields.length; y++){
            let item =  _.omit(record._fields[y].properties, cleandObject)
            if(item.createdAt){
              item.createdAt = formatDate(item.createdAt)
            }
            if( y ==0){
              Object.assign(obj,item)
            }else{
              obj[record._fields[y].labels[0].toLowerCase()] = item
            }
          }
          finalResult.push(obj)
        }
      }
      return finalResult
    }else{
      if(resultObj.createdAt){
        resultObj.createdAt = formatDate(resultObj.createdAt)
      }
      return _.omit(resultObj, cleandObject)
    }
}


  
exports.writeResponse = function writeResponse(res, response, status) {
  let meta ={
    status_code:status,
    success:true
  }
  let clientResponse = Object.assign({}, {meta}, {data:response})
  res.status(status || 200).json(clientResponse);
};

exports.writeError = function writeError(res, error, status) {
  console.log(error)
  res
    .status(error.status || status || 400)
    .json(_.omit(error, ["status"]));
};
