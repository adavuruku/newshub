import { Neo4jService } from './neo4j.service/neo4j.service';
import { DynamicModule, Module } from '@nestjs/common';
import { Neo4jConfig, Neo4jModuleAsyncOptions } from './neo4j-config.interface';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j.constants';

import { createDriver } from './neo4j.utils/neo4j.utils';

@Module({})
export class Neo4jModule {
  static forRoot(config: Neo4jConfig): DynamicModule {
    return {
      module: Neo4jModule,
      providers: [
        Neo4jService,
        {
          provide: NEO4J_CONFIG,
          useValue: config,
        },
        {
          provide: NEO4J_DRIVER,
          inject: [NEO4J_CONFIG],
          useFactory: async () => createDriver(config),
        },
      ],
      exports: [Neo4jService],
    };
  }

  static forRootAsync(options: Neo4jModuleAsyncOptions): DynamicModule {
    const providers = [
      Neo4jService,
      {
        provide: NEO4J_CONFIG,
        inject: [...options.inject],
        useFactory: async (config: any) => config.get('service.neo4j'),
      },
      {
        provide: NEO4J_DRIVER,
        inject: [NEO4J_CONFIG],
        useFactory: async (config: Neo4jConfig) => createDriver(config),
      },
    ];
    return {
      module: Neo4jModule,
      providers: [...providers],
      exports: [...providers],
    };
  }
}
