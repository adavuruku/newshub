import configuration from '../../../../../../config/configuration';
import { Pagination } from './pagination';
// jest.mock('./pagination');

describe('Pagination test', () => {
  let pagination: Pagination;
  let baseUrl: string;

  beforeEach(async () => {
    baseUrl = configuration().app.baseUrl;
  });

  test('Pagination should be defined', () => {
    pagination = new Pagination('/todos', baseUrl);
    expect(pagination).toBeDefined();
  });
  test('Pagination without  query parameters', () => {
    const pagination = new Pagination('/todos', baseUrl);
    expect(pagination.perPage).toBe(10);
  });
  test('Pagination with query parameters perPage only', () => {
    const pagination = new Pagination('/todos?perPage=20', baseUrl);
    expect(pagination.perPage).toBe(20);
  });
  test('Pagination with query parameters perPage and page > 0', () => {
    const pagination = new Pagination('/todos?perPage=20', baseUrl);
    expect(pagination.perPage).toBe(20);
    expect(pagination.done()).toBeInstanceOf(Object);
    expect(pagination.done()).toHaveProperty('totalCount');
    expect(pagination.done()).toHaveProperty('current');
    expect(pagination.done()).toHaveProperty('currentPage');
  });
  test('Pagination with query parameters perPage and page', () => {
    const pagination = new Pagination('/todos?perPage=20&page=2', baseUrl);
    expect(pagination.perPage).toBe(20);
    expect(pagination.done()).toBeInstanceOf(Object);
    expect(pagination.done()).toHaveProperty('totalCount');
    expect(pagination.done()).toHaveProperty('previous');
    expect(pagination.done()).toHaveProperty('previousPage');
    expect(pagination.done()).toHaveProperty('current');
    expect(pagination.done()).toHaveProperty('currentPage');
  });

  test('Pagination when set perPage', () => {
    const pagination = new Pagination('/todos?perPage=20&page=2', baseUrl);
    pagination.perPage = 10;
    expect(pagination.perPage).toBe(10);
  });
  test('Pagination when set skip', () => {
    const pagination = new Pagination('/todos?perPage=20&page=2', baseUrl);
    pagination.skip = 10;
    expect(pagination.skip).toBe(10);
  });
  test('Pagination when set skip', () => {
    const pagination = new Pagination('/todos?perPage=20&page=2', baseUrl);
    pagination.skip = 10;
    expect(pagination.skip).toBe(10);
  });

  test('Pagination when set next', () => {
    const pagination = new Pagination('/todos', baseUrl);
    pagination.next = 2;
    expect(pagination.done()).toBeInstanceOf(Object);
    expect(pagination.done()).toHaveProperty('next');
    expect(pagination.done().next).toBe(2);
  });
  test('Pagination when set totalCount', () => {
    const pagination = new Pagination('/todos', baseUrl);
    pagination.totalCount = 10;
    expect(pagination.done()).toBeInstanceOf(Object);
    expect(pagination.totalCount).toBe(10);
  });
  test('Pagination when get current', () => {
    const pagination = new Pagination('/todos', baseUrl);
    expect(pagination.done()).toBeInstanceOf(Object);
    expect(pagination.current).toBe(1);
  });
  test('Pagination when set more', () => {
    const pagination = new Pagination('/todos', baseUrl);
    pagination.more = true;
    expect(pagination.done().more).toBe(true);
    pagination.more = false;
    expect(pagination.done().more).toBe(false);
  });
  test('Pagination when set morePages', () => {
    const pagination = new Pagination('/todos', baseUrl);
    expect(pagination.done()).toBeInstanceOf(Object);
    expect(pagination.morePages(10)).toBe(false);
    expect(pagination.morePages(20)).toBe(true);
  });
});
