const {populatSchema, nodeNames} = require('./populateSchema')
exports.prepPagination = async (mainTable, mainTableQuery, populationOption, transaction) =>{

//     MATCH (user:User { id: '07bd4120-b078-4584-bdee-38366183acef' })
// OPTIONAL MATCH (user)<-[:CREATED_BY]-(post:Post {deleted:false})
//  RETURN distinct user, collect(distinct post) as p

    console.log(mainTable, mainTableQuery, populationOption)
    console.log('...mainTableQuery', {...mainTableQuery})
    // let mainQuery = `MATCH (${mainTable}:${nodeNames[mainTable]} ${{...mainTableQuery}})`
    // let mainQuery = `MATCH (${mainTable}:${nodeNames[mainTable]})`
    let mainQuery = `MATCH (${mainTable}:${nodeNames[mainTable]} { id: '07bd4120-b078-4584-bdee-38366183acef' })`
    let allQuery = [mainQuery]
    let populationShema = populatSchema[mainTable]
    console.log('populationShema :: ',populationShema)
    let returnValues = [`DISTINCT ${mainTable}`]
    if(populationOption.length > 0){ 
        for(let popu of populationOption){
            console.log('popu ', popu)
            if(populationShema[popu]){
                const {relationship, relationshiplabel} = populationShema[popu]
                const leftDirection = relationship === '<-' ? relationship:'-'
                const rightDirection = relationship === '->' ? relationship:'-'
                const popQuery = `OPTIONAL MATCH (${mainTable})${leftDirection}[:${relationshiplabel}]${rightDirection}(${popu}:${nodeNames[popu]} {deleted:false})`
                returnValues.push(`collect( distinct ${popu}) as ${popu}`)
                allQuery.push(popQuery)                
            }
        }
    }
    allQuery.push(`RETURN ${returnValues.join(', ')}`)
    allQuery = allQuery.join('\n')
    console.log('allQuery :: ', allQuery)
    // const queryResult =  await transaction.run(allQuery,{...searchCriteria})
    const queryResult =  await transaction.run(allQuery)
    return queryResult
}
exports.formatSearchQuery = async (searchObject) =>{
    let searchCriteria = {}
}
//     let query = [
//         'MATCH (user:User {id:$userId})',
//         'CREATE (post:Post {id: $id, title: $title, body: $body, createdAt: datetime(), deleted:false})',
//         'CREATE (user)-[user_post:CREATE_POST]->(post)',
//         'CREATE (post)-[post_user:CREATED_BY]->(user)',
//         'RETURN post'
//     ].join('\n')
//     const userExist =  await session.run(query,
//     {
//         id: uuid.v4(),
//         title: obj.title,
//         body: obj.body,
//         userId:obj.user
//     }
//   );