import * as _ from 'lodash';

/**
 * The QueryParser class
 */
export class QueryParser {
  private _all: any;

  /**
   * @constructor
   * @param {Object} query This is a query object of the request
   */
  constructor(public query: any) {
    this.initialize(query);
    const excluded = [
      'perPage',
      'page',
      'limit',
      'sort',
      'all',
      'includes',
      'selection',
      'population',
      'search',
      'regex',
      'nested',
    ];
    // omit special query string keys from query before passing down to the model for filtering
    this.query = _.omit(this.query, ...excluded);
    // Only get collection that has not been virtually deleted.
    _.extend(this.query, { deleted: false });
    Object.assign(this, this.query);
    // TODO: Show emma
  }

  private _sort: any;

  /**
   * when String i.e ?sort=name it is sorted by name ascending order
   * when Object ?sort[name]=desc {name: 'desc'} it is sorted by name descending order
   * when Object ?sort[name]=desc,sort[age]=asc {name: 'desc', age: 'asc'} it is sorted by name desc and age asc order
   *
   * @return {Object} get the sort property
   */
  get sort() {
    if (this._sort) {
      if (!_.isEmpty(this._sort)) {
        try {
          this._sort = JSON.parse(this._sort);
        } catch (e) {}
      }
      if (_.isObject(this._sort)) {
        for (const [column, direction] of Object.entries(this._sort)) {
          if (typeof direction === 'string')
            this._sort[column] = direction.toLowerCase() === 'asc' ? 1 : -1;
        }
      } else {
        const sort = {};
        for (const key of this._sort.split(',')) {
          sort[key] = 1;
        }
        return sort;
      }
      return this._sort;
    }
    return { createdAt: -1 };
  }

  private _selection: any;
  /**
   * @return {Object} get the selection property
   */
  get selection() {
    if (this._selection) {
      return this._selection;
    }
    return [];
  }

  /**
   * @param {Object} value is the population object
   */
  set selection(value) {
    this._selection = value;
    if (!_.isObject(value)) {
      try {
        this._selection = JSON.parse(String(value));
      } catch (e) {}
    }
  }

  private _page: any = null;

  /**
   * @return {Object} get the items to return in each page
   */
  get page() {
    return this._page;
  }

  /**
   * @param {Number} value is the current page number
   */
  set page(value) {
    this._page = value;
  }

  private _skip = 0;
  /**
   * @return {Object} get the no of items to skip
   */
  get skip() {
    return ((this._page <= 0 ? 1 : this._page) - 1) * this._perPage;
  }

  private _perPage: any = null;

  /**
   * @return {Object} get the items to return in each page
   */
  get perPage() {
    return this._perPage;
  }

  /**
   * @param {Number} value is the perPage number
   */
  set perPage(value) {
    this._perPage = value;
  }

  private _population: any;

  /**
   * @return {Object} get the population object for query
   */
  get population() {
    if (this._population) {
      return this._population;
    }
    return [];
  }

  /**
   * @param {Object} value is the population object
   */
  set population(value) {
    this._population = value;
    if (!_.isObject(value)) {
      try {
        this._population = JSON.parse(String(value));
      } catch (e) {}
    }
  }

  private _search: any;

  /**
   * @return {Object} get the parsed query
   */
  get search() {
    return this._search;
  }

  /**
   * @return {Boolean} get the value for all data request
   */
  get getAll() {
    return this._all;
  }

  /**
   *  Initialise all the special object required for the find query
   *  @param {Object} query This is a query object of the request
   */
  initialize(query) {
    this._all = query.all;
    this._sort = query.sort;
    if (query.population) {
      this.population = query.population;
    }
    if (query.search) {
      this._search = query.search;
    }
    if (query.selection) {
      this.selection = query.selection;
    }
    if (query.page) {
      this._page = parseInt(query.page);
    }
    if (query.perPage) {
      this._perPage = parseInt(query.perPage);
    }
  }
}
