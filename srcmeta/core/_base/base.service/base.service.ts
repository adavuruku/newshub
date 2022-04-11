import { RelationshipType } from './../../../interfaces/relationshipType';
import { NodeType } from './../../../interfaces/nodeType';
import { ResponseOption } from '../../../interfaces';
import { AppResponse, QueryParser } from '../../../_shared/common';
import configuration from '../../../../../../config/configuration';
import { BaseDao } from '../base.dao/base.dao';

export abstract class BaseService {
  public baseUrl = configuration().app.baseUrl;
  public itemsPerPage = 10;
  public identifier = 'todo';
  protected dao: BaseDao;

  public getDao() {
    return this.dao;
  }

  /**
   * @param {ResponseOption} option: required email for search
   * @return {Object} The formatted response
   */
  public async getResponse(option: ResponseOption) {
    try {
      const meta: any = AppResponse.getSuccessMeta();
      if (option.token) {
        meta.token = option.token;
      }
      Object.assign(meta, { statusCode: option.code });
      if (option.message) {
        meta.message = option.message;
      }
      if (option.pagination && !option.queryParser.getAll) {
        option.pagination.totalCount = option.count;
        if (option.pagination.morePages(option.count)) {
          option.pagination.next = option.pagination.current + 1;
        }
        meta.pagination = option.pagination.done();
      }
      if (
        option.value &&
        option.queryParser &&
        option.queryParser.population.length > 0 &&
        option.queryParser.query
      ) {
        option.value = await this.dao.cypherGenerator(option.queryParser);
      }
      return AppResponse.format(meta, option.value);
    } catch (e) {
      throw e;
    }
  }

  /**
   * @param {Object} payload from request body
   * @return {Object} the created data
   */

  async create(payload: Record<string, any>) {
    const error = await this.validateCreate(payload);
    if (error) {
      return error;
    }
    const result = await this.dao.create(payload);
    let data = await this.dao.getData(result, []);
    const postData = await this.postCreateResponse(data);
    if (postData) {
      data = Object.assign({}, data, postData);
    }
    return data;
  }

  /**
   * @param {Object} payload from request body
   * @return {Object} the updated data
   */
  async update(id: string, payload: any) {
    const object = await this.dao.get(id);
    const error = await this.validateUpdate(object, payload);
    if (error) {
      return error;
    }
    const result = await this.dao.update(id, payload);
    let data = await this.dao.getData(result, []);
    const postData = await this.postUpdateResponse(data);
    if (postData) {
      data = Object.assign({}, data, postData);
    }
    return data;
  }

  /**
   * @param {Object} query from request querystring
   * @return {Object} the matching data
   */
  async find(queryParser: QueryParser) {
    const [resultData, resultCount] = await Promise.all([
      this.dao.find(queryParser),
      this.dao.count(queryParser.query),
    ]);
    return {
      // value: this.dao.getAllData(resultData, queryParser.selection),
      // value: await this.dao.formatcypherQueryPopulationResult(
      //   resultData,
      //   queryParser.selection,
      // ),
      value: resultData,
      count: resultCount.records[0].get('total').low,
    };
  }

  /**
   * @param {String} id the unique identifier of the object
   * @param {Object} query from request querystring
   * @return {Object} the matching data
   */
  async get(id: string, queryParser: QueryParser) {
    const result = await this.dao.get(id, queryParser.query);
    return this.dao.getData(result, queryParser.selection);
  }

  /**
   * @param {String} id the unique identifier of the object
   * @return {Object} the deleted data
   */
  async delete(id: string) {
    const object = await this.dao.get(id);
    const error = await this.validateDelete(object);
    if (error) {
      return error;
    }
    const result = await this.dao.delete(id);
    let data = this.dao.getData(result, []);
    const postData = await this.postDeleteResponse(data);
    if (postData) {
      data = Object.assign({}, data, postData);
    }
    return {
      [`${this.dao.identifier}_id`]: data[`${this.dao.identifier}_id`],
    };
  }

  /**
   * @param {NodeType} parent the unique identifier of the object
   * @param {NodeType} child the unique identifier of the object
   * @return {Object} the deleted data
   */
  async createRelationship(
    parent: NodeType,
    child: NodeType,
    relation: RelationshipType,
  ) {
    const result = await this.dao.createRelationship(parent, child, relation);
    return {
      data: result,
    };
  }

  /**
   * @param {Object} obj required for response
   * @return {Object}
   */
  async validateCreate(obj: Record<string, any>) {
    return null;
  }

  /**
   * @param {Object} obj required for response
   * @return {Object}
   */
  async retrieveExistingResource(obj: Record<string, any>) {
    Object.assign(obj, { deleted: false });
    return await this.dao.search(obj);
  }

  /**
   * @param {Object} obj required for response
   * @return {Object}
   */
  async postCreateResponse(obj: Record<string, any>) {
    return null;
  }

  // /**
  //  * @param {Object} obj required for response
  //  * @return {Object}
  //  */
  // async createRelationshipResponse(obj: Record<string, any>) {
  //   return null;
  // }

  // /**
  //  * @param {Object} obj required for response
  //  * @return {Object}
  //  */
  // async findWithPopulateResponse(obj: Record<string, any>) {
  //   return null;
  // }

  /**
   * @param {Object} current required for response
   * @param {Object} obj required for response
   * @return {Object}
   */
  async validateUpdate(current: Record<string, any>, obj: Record<string, any>) {
    return null;
  }

  /**
   * @param {Object} obj required for response
   * @return {Object}
   */
  async postUpdateResponse(obj: Record<string, any>) {
    return null;
  }

  /**
   * @param {Object} current required for response
   * @return {Object}
   */
  async validateDelete(current: Record<string, any>) {
    return null;
  }

  /**
   * @param {Object} obj required for response
   * @return {Object}
   */
  async postDeleteResponse(obj: Record<string, any>) {
    return null;
  }
}
