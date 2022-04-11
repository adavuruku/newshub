import { QueryParser } from './query-parser';

describe('QueryParser - test', () => {
  let queryParser: any;
  beforeEach(() => {
    const query = {};
    queryParser = new QueryParser(query);
  });
  it('QueryParser - should be defined', () => {
    expect(queryParser).toBeDefined();
  });

  it('QueryParser.initialize - should be call initialize', () => {
    const query = {};
    jest.spyOn(queryParser, 'initialize');
    queryParser.initialize(query);
    expect(queryParser.initialize).toHaveBeenCalledTimes(1);
  });
  it('QueryParser.initialize - if population, search and selection are given', () => {
    const query = {
      limit: 1,
      population: ['title'],
      sort: '-createdAt',
      all: true,
      search: 'test',
      selection: ['title'],
    };

    queryParser.initialize(query);
    expect(queryParser.population).toEqual(['title']);
    expect(queryParser.sort).toEqual({ '-createdAt': 1 });
    expect(queryParser.search).toBe('test');
    expect(queryParser.selection).toEqual(['title']);
  });
  it('QueryParser.initialize - if population only', () => {
    const query = {
      population: ['title'],
    };

    queryParser.initialize(query);
    expect(queryParser.population).toEqual(['title']);
    expect(queryParser.sort).toEqual({ createdAt: -1 });
    expect(queryParser.search).toBe(undefined);
    expect(queryParser.selection).toEqual([]);
  });
  it('QueryParser.initialize - if search only', () => {
    const query = {
      search: 'test',
    };

    queryParser.initialize(query);
    expect(queryParser.population).toEqual([]);
    expect(queryParser.sort).toEqual({ createdAt: -1 });
    expect(queryParser.search).toBe('test');
    expect(queryParser.selection).toEqual([]);
  });
  it('QueryParser.initialize - if selection only', () => {
    const query = {
      selection: ['title'],
    };

    queryParser.initialize(query);
    expect(queryParser.population).toEqual([]);
    expect(queryParser.sort).toEqual({ createdAt: -1 });
    expect(queryParser.search).toBe(undefined);
    expect(queryParser.selection).toEqual(['title']);
  });
  it('QueryParser.sort - if sort is defined', () => {
    const query = {
      sort: 'createdAt',
    };
    queryParser.initialize(query);
    expect(queryParser.sort).toEqual({ createdAt: 1 });
  });
  it('QueryParser.sort - sort with { name: asc} ', () => {
    const query = {
      sort: { name: 'asc' },
    };
    queryParser.initialize(query);
    expect(queryParser.sort).toEqual({ name: 1 });
  });
  it('QueryParser.sort - sort with { name: asc, age: desc} ', () => {
    const query = {
      sort: { name: 'asc', age: 'desc' },
    };
    queryParser.initialize(query);
    expect(queryParser.sort).toEqual({ age: -1, name: 1 });
  });
  it('QueryParser.sort - if sort is undefined', () => {
    const query = {
      sort: undefined,
      page: 1,
      perPage: 1,
    };
    queryParser.initialize(query);
    expect(queryParser.sort).toEqual({ createdAt: -1 });
  });

  it('QueryParser.all - should return all special query', () => {
    const query = {
      all: true,
    };
    queryParser.initialize(query);
    expect(queryParser.getAll).toBe(true);
  });

  it('QueryParser set population - if population parse', () => {
    queryParser.population = ['title'];
    expect(queryParser.population).toEqual(['title']);
  });

  it('QueryParser set population - if population doent parse', () => {
    jest.spyOn(console, 'log');
    queryParser.population = undefined;
    // expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('QueryParser set selection - if selection parse', () => {
    queryParser.selection = 'title';
    expect(queryParser.selection).toEqual('title');
  });

  it('QueryParser set page ', () => {
    queryParser.page = 0;
    queryParser.perPage = 1;
    expect(queryParser.page).toEqual(0);
    expect(queryParser.perPage).toEqual(1);
    expect(queryParser.skip).toEqual(
      ((queryParser.page <= 0 ? 1 : queryParser.page) - 1) *
        queryParser.perPage,
    );
  });
  it('QueryParser set page ', () => {
    queryParser.page = 1;
    queryParser.perPage = 1;
    expect(queryParser.page).toEqual(1);
    expect(queryParser.perPage).toEqual(1);
    expect(queryParser.skip).toEqual(
      ((queryParser.page <= 0 ? 1 : queryParser.page) - 1) *
        queryParser.perPage,
    );
  });
});
