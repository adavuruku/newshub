/* eslint-disable @typescript-eslint/no-unused-vars */
import { NodeType } from '../../../interfaces/nodeType';
import {
  RelationshipDirection,
  RelationshipType,
} from '../../../interfaces/relationshipType';
import { Neo4jService } from '../../../neo4j/neo4j.service/neo4j.service';
import neo4j from 'neo4j-driver';
import * as _ from 'lodash';
import { AppException } from '../../../_shared/exceptions';
import {
  nodeNames,
  populationSchema,
} from '../../../_shared/common/app-response/populate-schema';
import { QueryParser } from '../../../_shared/common';

/**
 * BaseDao class to be extended by children classes
 */
export class BaseDao {
  public identifier = 'book';
  public itemsToOmit = ['page', 'perPage', 'selection'];
  protected labelName = 'Base';
  protected softDelete = true;
  protected limit = 10;
  protected skip = 0;
  protected fillables = [];
  protected updateFillables = [];

  constructor(protected readonly neo4jService: Neo4jService) {}

  /**
   * To generate unique id for a node
   *
   * @return {String} returns data with the new uuid value generated
   */
  async getId() {
    const result = await this.neo4jService.read(
      'RETURN apoc.create.uuid() as uuid',
      {},
    );
    return result.records[0].get('uuid');
  }

  /**
   * @param {Object} obj the payload from request body
   * @return {Object} returns the data for client response
   */
  async create(obj: Record<string, any>) {
    let payload = { ...obj };
    const tofill = this.fillables;
    if (tofill && tofill.length > 0) {
      payload = _.pick(obj, ...tofill);
    }
    const uniqueId = await this.getId();
    const cypher = this.getCreateCypher(payload);
    return this.neo4jService.write(cypher, {
      payload: {
        ...payload,
        [`${this.identifier}_id`]: uniqueId,
        deleted: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    });
  }

  /**
   * @param {Object} queryParser the payload from request body
   * @return {Object} returns the data for client response
   */
  async cypherGenerator(queryParser: QueryParser) {
    const query = queryParser.query;
    const selection = queryParser.selection;
    const population = queryParser.population;
    const mainQuery = `MATCH (${this.identifier}:${
      nodeNames[this.identifier]
    } {${this.renderProperties(query)}})`;
    const allQuery = [mainQuery];
    const populationexactShema = populationSchema[this.identifier];
    const returnValues = [`DISTINCT ${this.identifier}`];
    if (population.length > 0) {
      for (const popu of population) {
        if (populationexactShema[popu]) {
          const { relationship, relationshiplabel } =
            populationexactShema[popu];
          const leftDirection =
            relationship === RelationshipDirection.BACKWARD
              ? relationship
              : RelationshipDirection.BOTH;

          const rightDirection =
            relationship === RelationshipDirection.FORWARD
              ? relationship
              : RelationshipDirection.BOTH;

          const popQuery = `OPTIONAL MATCH (${this.identifier})${leftDirection}[:${relationshiplabel}]${rightDirection}(${popu}:${nodeNames[popu]} {deleted:false})`;
          returnValues.push(`collect( distinct ${popu}) as ${popu}`);
          allQuery.push(popQuery);
        }
      }
    }
    allQuery.push(`RETURN ${returnValues.join(', ')} SKIP $skip LIMIT $limit`);
    const joinAllQuery = allQuery.join('\n');
    const queryResult = await this.neo4jService.read(joinAllQuery, {
      ...query,
      skip: neo4j.int(queryParser.skip || this.skip),
      limit: neo4j.int(queryParser.perPage || this.limit),
    });
    return this.formatCypherQueryPopulationResult(queryResult, selection);
  }

  /**
   * @param {Object} record neo4j single Node
   * @return {Object} returns the clean properties of the node
   */
  getSingleItem(record, selection) {
    const excludeFromResult = ['password', 'api_key', 'deleted', 'active'];
    let item = _.omit(record.properties, excludeFromResult);
    if (_.isArray(selection) && selection.length > 0) {
      item = _.pick(item, selection);
    }

    // if (item.createdAt) {
    //   const date = new Date(item.createdAt);
    //   item.createdAt = date.getTime();
    // }
    // if (item.updatedAt) {
    //   const date = new Date(item.updatedAt);
    //   console.log('date.getTime()  ', date.getTime());
    //   item.updatedAt = date.getTime();
    // }
    // console.log('item  ', item.updatedAt, item.createdAt);
    // console.log(`${newDate.toDateString()} ${newDate.toTimeString()}`);
    return item;
  }

  /**
   * @param {Object} resultObj the unique identifier of the object
   * @param {Object} selectedFields the payload from request body
   * @return {Object} returns the data for client response
   */
  async formatCypherQueryPopulationResult(resultObj, selectedFields) {
    const finalResult = [];
    if (_.isArray(resultObj.records)) {
      const allrecs = resultObj.records.length;
      if (allrecs > 0) {
        // iterate each records
        for (let i = 0; i < allrecs; i++) {
          const obj = {};
          const record = resultObj.records[i];
          const allKeys = resultObj.records[i].keys;
          // each record can have more than one nodes (labels) or return
          for (let y = 0; y < allKeys.length; y++) {
            if (y == 0) {
              // the first key will be the parent node
              Object.assign(
                obj,
                this.getSingleItem(record.get(allKeys[y]), selectedFields),
              );
            } else {
              // the rest keys will be the child node we have put in collection
              // -> collection will be an array when more than one but object when is just one
              if (_.isArray(record.get(allKeys[y]))) {
                obj[`${allKeys[y].toLowerCase()}s`] = _.map(
                  record.get(allKeys[y]),
                  (eachNode) => {
                    return this.getSingleItem(eachNode, []);
                  },
                );
              } else {
                obj[allKeys[y].toLowerCase()] = this.getSingleItem(
                  record.get(allKeys[y]),
                  selectedFields,
                );
              }
            }
          }
          finalResult.push(obj);
        }
      }
      return finalResult;
    } else {
      //no population
      return this.getSingleItem(resultObj, selectedFields);
    }
  }

  /**
   * @param {String} id the unique identifier of the object
   * @param {Object} obj the payload from request body
   * @return {Object} returns the data for client response
   */
  async update(id: string, obj: Record<string, any>) {
    let payload = { ...obj };
    const tofill = this.updateFillables || this.fillables;
    if (tofill && tofill.length > 0) {
      payload = _.pick(obj, ...tofill);
    }
    const cypher = this.getUpdateCypher(id, obj);
    return this.neo4jService.write(cypher, {
      [`${this.identifier}_id`]: id,
      payload: {
        ...payload,
        updatedAt: Date.now(),
      },
    });
  }

  /**
   * @param {Object} query the query parameters from request query
   * @return {Object} returns the data for client response
   */
  count(query?: any) {
    const cypher = `match (${this.identifier}:${this.labelName} {deleted: $deleted}) With count(${this.identifier}) as total Return total`;
    return this.neo4jService.read(cypher, {
      ...query,
    });
  }

  /**
   * @param {Object} query the query parameters from request query
   * @return {Object} returns the data for client response
   */
  async find(queryParser: QueryParser) {
    return await this.cypherGenerator(queryParser);
    // const cypher = this.getFindCypher(queryParser.query);
    // return this.neo4jService.read(cypher, {
    //   ...queryParser.query,
    //   skip: neo4j.int(queryParser.skip || this.skip),
    //   limit: neo4j.int(queryParser.perPage || this.limit),
    // });
  }

  /**
   * @param {Object} query the query parameters from request query
   * @return {Object} returns the data for client response
   */
  async search(query: any = {}) {
    const cypher = this.getSearchCypher(query);
    const result = await this.neo4jService.read(cypher, {
      ...query,
    });
    if (result.records.length > 0) {
      return result.records[0].get(`${this.identifier}s`).properties;
    }
    return null;
  }

  /**
   * @param {String} id the unique identifier of the object
   * @param {Object} q the query parameters from request query
   * @return {Object} returns the data for client response
   */
  get(id: string, query: any = {}) {
    // const cypherQuery = {
    //   [`${this.identifier}_id`]: id,
    //   ...q,
    // };
    const cypher = this.getFindOneCypher(id, query);
    return this.neo4jService.read(cypher, {
      ...query,
    });
  }

  /**
   * @param {NodeType} parent  the object representing the parent node
   * @param {NodeType} child  the object representing the child node
   * @param {RelationshipType} relation  the object that define the relationship between the nodes (direction, type)
   * @return {Object} returns the data for client response
   */
  createRelationship(
    parent: NodeType,
    child: NodeType,
    relation: RelationshipType,
  ) {
    const cypher = this.getCreateRelationShipCypher(parent, child, relation);
    return this.neo4jService.write(cypher, {
      ...parent.attributes,
      ...child.attributes,
      ...relation.attributes,
    });
  }

  /**
   * @param {Object} properties is a key value pairs
   * @return {Object} returns a string formatted valid neo4j property entry
   */
  renderProperties = (properties) => {
    if (_.isEmpty(properties)) {
      return '';
    }
    const attribs = [];
    for (const key of Object.keys(properties)) {
      if (key === 'id') {
        attribs.push(`${this.identifier}_${key}:$${key}`);
      } else {
        attribs.push(`${key}:$${key}`);
      }
    }
    return attribs.join(',');
  };

  public async getByLabel(
    label: string,
    id: string,
    query: Record<string, any>,
  ) {
    const result = await this.neo4jService.read(
      `MATCH (data:${label} {id: $id}) RETURN data`,
      {
        [`${this.identifier}_id`]: id,
        ...query,
      },
    );

    return this.getData(result, 'label');
    // return this.formatcypherQueryResult(result);
  }

  /**
   * @param {String} id the unique identifier of the object
   * @return {Object} returns the data for client response
   */
  delete(id: string) {
    if (this.softDelete) {
      return this.update(id, { deleted: true });
    }
    const cypher = this.getDeleteOneCypher(id);
    return this.neo4jService.read(cypher, {
      [`${this.identifier}_id`]: id,
    });
  }

  /**
   * @param {Object} result the neo4j response data
   * @param {String} key the key to be retrieved from neo4j records
   * @return {Object} returns the data for client response
   */
  getData = (result, selection, key?: string) => {
    if (result.records.length === 0) {
      throw AppException.NOT_FOUND(`${this.labelName} not found`);
    }
    // return result.records[0].get(key || this.identifier).properties;
    return this.getSingleItem(
      result.records[0].get(key || this.identifier),
      selection,
    );
  };

  /**
   * @param {Object} result the neo4j response data
   * @param {String} key the key to be retrieved from neo4j records
   * @return {Object} returns the data for client response
   */
  getAllData = (result, selection, key?: string) => {
    return result.records.map((record) =>
      this.getSingleItem(record.get(key || `${this.identifier}s`), selection),
    );
    // record.get(key || `${this.identifier}s`).properties,
  };

  /**
   * @param {Object} obj the payload from request body
   * @return {String} returns the cypher query
   */
  protected getCreateCypher(obj: Record<string, any>) {
    return `CREATE (${this.identifier}:${this.labelName} $payload) return ${this.identifier}`;
  }

  /**
   * @param {String} id the unique identifier of the object
   * @param {Object} obj the payload from request body
   * @return {String} returns the cypher query
   */
  protected getUpdateCypher(id: string, obj: Record<string, any>) {
    return `MATCH (${this.identifier}:${this.labelName} {${this.identifier}_id: $${this.identifier}_id})  SET ${this.identifier} +=$payload RETURN ${this.identifier}`;
  }

  /**
   * @param {Object} query the query parameters from request query
   * @return {String} returns the cypher query
   */
  protected getFindCypher(query: Record<string, any>) {
    return `MATCH (${this.identifier}s:${
      this.labelName
    } {${this.renderProperties(query)}}) RETURN ${
      this.identifier
    }s SKIP $skip LIMIT $limit`;
  }

  /**
   * @param {Object} query the query parameters from request query
   * @return {String} returns the cypher query
   */
  protected getSearchCypher(query: Record<string, any>) {
    return `MATCH (${this.identifier}s:${
      this.labelName
    } {${this.renderProperties(query)}}) RETURN ${this.identifier}s`;
  }

  /**
   * @param {String} id the unique identifier of the object
   * @param {Object} query the query parameters from request query
   * @return {String} returns the cypher query
   */
  protected getFindOneCypher(id: string, query: Record<string, any>) {
    return `MATCH (${this.identifier}:${
      this.labelName
    } {${this.renderProperties(query)}}) RETURN ${this.identifier}`;
  }

  /**
   * @param {NodeType} parent the unique identifier of the object
   * @param {NodeType} child the unique identifier of the object
   * @param {RelationshipType} relation the unique identifier of the object
   * @return {string} returns the cypher query
   */
  protected getCreateRelationShipCypher(
    parent: NodeType,
    child: NodeType,
    relation: RelationshipType,
  ) {
    const direction = relation.direction || RelationshipDirection.FORWARD;
    return `MATCH (p:${parent.label} {${this.renderProperties(
      parent.attributes,
    )}}), (c:${child.label} {${this.renderProperties(
      child.attributes,
    )}}) CREATE (p)-[r:${relation.type} {${this.renderProperties(
      relation.attributes,
    )}}]${direction}(c)
    RETURN c`;
  }

  /**
   * @param {String} id the unique identifier of the object
   * @return {String} returns the cypher query
   */
  protected getDeleteOneCypher(id: string) {
    return `MATCH (${this.identifier}:${this.labelName} {${this.identifier}_id:$id}) DETACH DELETE ${this.identifier} RETURN ${this.identifier}`;
  }
}
