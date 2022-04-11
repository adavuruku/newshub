/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jService } from './neo4j.service';
import { INestApplication } from '@nestjs/common';

export interface SessionMockOption {
  database?: string;
  defaultAccessMode?: any;
}

describe('Neo4jService', () => {
  let neo4jService: Neo4jService;
  let app: INestApplication;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Neo4jService,
        {
          provide: 'NEO4J_CONFIG',
          useValue: {
            database: 'config.database',
          },
        },
        {
          provide: 'NEO4J_DRIVER',
          useValue: {
            session: (options: SessionMockOption) => ({
              database: options.database,
              defaultAccessMode: options.defaultAccessMode,
              run: () => ({}),
            }),
            rxSession: (options: SessionMockOption) => ({
              database: options.database,
              defaultAccessMode: options.defaultAccessMode,
              run: () => ({}),
            }),

            close: () => ({}),
          },
        },
      ],
    }).compile();
    app = module.createNestApplication();
    neo4jService = module.get<Neo4jService>(Neo4jService);
    await app.init();
  });
  describe('Neo4jService', () => {
    it('Neo4jService - should be defined', () => {
      expect(neo4jService).toBeDefined();
    });
    describe('Neo4jService - getDriver', () => {
      it('Neo4jService - getDriver should be defined', () => {
        expect(neo4jService.getDriver).toBeDefined();
      });
      it('Neo4jService - getDriver is called', () => {
        expect(neo4jService.getDriver()).toBeTruthy();
        expect(neo4jService.getDriver()).toBeInstanceOf(Object);
        expect(neo4jService.getDriver()).toHaveProperty('session');
        expect(neo4jService.getDriver()).toHaveProperty('rxSession');
        expect(neo4jService.getDriver()).toHaveProperty('close');
      });
    }),
      describe('Neo4jService - getConfig', () => {
        it('Neo4jService - getConfig should be defined', () => {
          expect(neo4jService.getConfig).toBeDefined();
        });
        it('Neo4jService - getConfig is called', () => {
          expect(neo4jService.getConfig()).toBeTruthy();
          expect(neo4jService.getConfig()).toBeInstanceOf(Object);
          expect(neo4jService.getConfig()).toHaveProperty('database');
        });
      }),
      describe('Neo4jService - getReadSession', () => {
        it('Neo4jService - getReadSession should be defined', () => {
          expect(neo4jService.getReadSession).toBeDefined();
        });

        it('Neo4jService - getReadSession is called', () => {
          expect(neo4jService.getReadSession()).toBeInstanceOf(Object);
          expect(neo4jService.getReadSession()).toHaveProperty('database');
          expect(neo4jService.getReadSession('mydatabase')).toHaveProperty(
            'database',
          );
          expect(neo4jService.getReadSession()).toHaveProperty(
            'defaultAccessMode',
          );
        });
      }),
      describe('Neo4jService - getRxReadSession', () => {
        it('Neo4jService - getRxReadSession should be defined', () => {
          expect(neo4jService.getRxReadSession).toBeDefined();
        });

        it('Neo4jService - getRxReadSession is called', () => {
          expect(neo4jService.getRxReadSession()).toBeInstanceOf(Object);
          expect(neo4jService.getRxReadSession()).toHaveProperty('database');
          expect(neo4jService.getRxReadSession('mydatabase')).toHaveProperty(
            'database',
          );
          expect(neo4jService.getRxReadSession()).toHaveProperty(
            'defaultAccessMode',
          );
        });
      }),
      describe('Neo4jService - getRxWriteSession', () => {
        it('Neo4jService - getRxWriteSession should be defined', () => {
          expect(neo4jService.getRxWriteSession).toBeDefined();
        });

        it('Neo4jService - getRxReadSession is called', () => {
          expect(neo4jService.getRxWriteSession()).toBeInstanceOf(Object);
          expect(neo4jService.getRxWriteSession()).toHaveProperty('database');
          expect(neo4jService.getRxWriteSession('mydatabase')).toHaveProperty(
            'database',
          );
          expect(neo4jService.getRxWriteSession()).toHaveProperty(
            'defaultAccessMode',
          );
        });
      }),
      describe('Neo4jService - getWriteSession', () => {
        it('Neo4jService - getWriteSession should be defined', () => {
          expect(neo4jService.getWriteSession).toBeDefined();
        });

        it('Neo4jService - getWriteSession is called', () => {
          expect(neo4jService.getWriteSession()).toBeInstanceOf(Object);
          expect(neo4jService.getWriteSession()).toHaveProperty('database');
          expect(neo4jService.getWriteSession('mydatabase')).toHaveProperty(
            'database',
          );
          expect(neo4jService.getWriteSession()).toHaveProperty(
            'defaultAccessMode',
          );
        });
      }),
      describe('Neo4jService - read', () => {
        const cypher = 'MATCH (n) RETURN n';
        it('Neo4jService - read should be defined', () => {
          expect(neo4jService.read).toBeDefined();
        });
        it('Neo4jService - read is called', () => {
          expect(neo4jService.read(cypher, {})).toBeTruthy();
        });
      }),
      describe('Neo4jService - write', () => {
        const cypher =
          'CREATE (t: Todo {title: string; description: string}) RETURN t';
        it('Neo4jService - write should be defined', () => {
          expect(neo4jService.write).toBeDefined();
        });
        it('Neo4jService - write is called', () => {
          expect(neo4jService.write(cypher, {})).toBeTruthy();
        });
      }),
      describe('Neo4jService - onApplicationShutdown', () => {
        it('Neo4jService - onApplicationShutdown should be defined', () => {
          expect(neo4jService.onApplicationShutdown).toBeDefined();
        });

        it('Neo4jService - onApplicationShutdown is called', () => {
          expect(neo4jService.onApplicationShutdown()).toBeTruthy();
        });
      });
  });
});
