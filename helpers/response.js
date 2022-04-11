var _ = require("lodash");
const {populatSchema, nodeNames} = require('./populateSchema')
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
  console.log('resultObj : ', resultObj)
  // console.log('resultObj prop : ', resultObj.records[0]._fields[0].properties)
  // console.log('resultObj get : ', resultObj.records[0].get('user').properties)
  // console.log('resultObj get : ', resultObj.records[0].get('post'))
  // console.log('resultObj keys : ', resultObj.records[0].keys)
  // console.log('resultObj length : ', resultObj.records[0].length)
  // console.log('resultObj ._fields : ', resultObj.records[0]._fields)
  // console.log('resultObj ._fieldLookup : ', resultObj.records[0]._fieldLookup)
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

exports.formatResponseAll = async (resultObj) => {
  console.log('resultObj : ', resultObj)
  console.log('resultObj prop : ', resultObj.records[0]._fields[0].properties)
  console.log('resultObj get : ', resultObj.records[0].get('user').properties)
  console.log('resultObj get : ', resultObj.records[0].get('post'))
  console.log('resultObj keys : ', resultObj.records[0].keys)
  console.log('resultObj length : ', resultObj.records[0].length)
  console.log('resultObj ._fields : ', resultObj.records[0]._fields)
  console.log('resultObj ._fieldLookup : ', resultObj.records[0]._fieldLookup)
  // {
  //   records:[
  //     {
  //       keys
  //     }
  //   ]
  // }
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

const getSingleItem = (record) => {
  let cleandObject = ['password', 'api_key', 'deleted','active']
  let item =  _.omit(record.properties, cleandObject)
  // let item =  _.omit(allFields[y].properties, cleandObject)
  // item =  _.omit(record.get(allFields[y]).properties, cleandObject)
  if(item.createdAt){
    item.createdAt = formatDate(item.createdAt)
  }
  return item
}
exports.formatResponseNew = async (resultObj) => {
  let finalResult = []
  if(_.isArray(resultObj.records)){
    let allrecs = resultObj.records.length
    if (allrecs > 0) {
      // iterate each records
      for(let i = 0; i < allrecs; i++){
        let obj = {}
        const record = resultObj.records[i]
        let allKeys = resultObj.records[i].keys
        // each record can have more than one nodes (labels) or return
        for(let y=0 ; y < allKeys.length; y++){
          if( y==0){
            // the first key will be the parent node
            Object.assign(obj,getSingleItem(record.get(allKeys[y])))
          }else{
            // the rest keys will be the child node we have put in collection -> collection will be an array when more than one but object when is just one
            if(_.isArray(record.get(allKeys[y]))){
              obj[`${allKeys[y].toLowerCase()}s`] = _.map(record.get(allKeys[y]), eachNode => {
                return getSingleItem(eachNode);
              })
            }else{
              obj[allKeys[y].toLowerCase()] = getSingleItem(record.get(allKeys[y]));
            }
          }
        }
        finalResult.push(obj)
      }
    }
    return finalResult
  }else{
    //no population
    return  getSingleItem(resultObj);
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
