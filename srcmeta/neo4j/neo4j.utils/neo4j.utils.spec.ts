/* eslint-disable @typescript-eslint/no-unused-vars */
import { createDriver } from './neo4j.utils';
import neo4j from 'neo4j-driver';
jest.mock('neo4j-driver');
// const createDriver = require('./neo4j.utils');

describe('createDriver -test', () => {
  // beforeEach(async () => {});
  it('createDriver - should be defined', () => {
    expect(createDriver).toBeDefined();
  });
  it('createDriver - should return neo4j driver', async () => {
    // const driver = await createDriver({
    //   scheme: 'bolt',
    //   host: 'localhost',
    //   port: 7687,
    //   username: 'neo4j',
    //   password: 'password@123456',
    // });
  });
});
