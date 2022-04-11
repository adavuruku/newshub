import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Neo4jModule } from '../../neo4j/neo4j.module';
import { Neo4jService } from '../../neo4j/neo4j.service/neo4j.service';
import { AttributesService } from '../attributes/service/attributes.service';
import { GenreService } from '../genre/service/genre.service';
import { SaleOptionService } from '../sale-option/service/sale-option.service';
import { SeriesService } from '../series/service/series.service';
import { BooksController } from './controller/books.controller';
import { BooksDao } from './dao/books.dao';
import { BooksService } from './service/books.service';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
    }),
  ],
  controllers: [BooksController],
  providers: [
    BooksService,
    BooksDao,
    Neo4jService,
    AttributesService,
    GenreService,
    SeriesService,
    SaleOptionService,
  ],
  exports: [BooksService],
})
export class BooksModule {}
