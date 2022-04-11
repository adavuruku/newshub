import { ModuleMetadata, Type } from '@nestjs/common';

export type Neo4jScheme =
  | 'neo4j'
  | 'neo4j+s'
  | 'neo4j+ssc'
  | 'bolt'
  | 'bold+s'
  | 'bold+ssc';

export interface Neo4jConfig {
  scheme: Neo4jScheme;
  host: string;
  port: number | string;
  username: string;
  password: string;
  database?: string;
}

export interface Neo4jOptionsFactory {
  createNeo4jOptions(): Promise<Neo4jConfig> | Neo4jConfig;
}

export interface Neo4jModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: any;
  useClass?: Type<Neo4jOptionsFactory>;
  inject?: any[];
}
