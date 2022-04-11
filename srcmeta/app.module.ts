import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../../config/configuration';
import { Neo4jModule } from './neo4j/neo4j.module';
import { AppService } from './app.service';
import { AttributesModule } from './main/attributes/attributes.module';
import { BooksModule } from './main/books/books.module';
import { GenreModule } from './main/genre/genre.module';
import { SeriesModule } from './main/series/series.module';
import { SaleOptionModule } from './main/sale-option/sale-option.module';
import { SceneModule } from './main/scene/scene.module';
import { UserModule } from './main/user/user.module';
import { CharacterModule } from './main/character/character.module';
import { ArtistModule } from './main/artist/artist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '_env/service/.env',
        '_env/.env',
        '_env/service/.env.stg',
        '_env/.env',
        '_env/service/.env.test',
      ],
      load: [configuration],
    }),
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
    }),
    CoreModule,
    GenreModule,
    AttributesModule,
    BooksModule,
    SeriesModule,
    SceneModule,
    UserModule,
    CharacterModule,
    ArtistModule,
    SeriesModule,
    SaleOptionModule,
    SceneModule,
    UserModule,
    CharacterModule,
    ArtistModule,
  ],
  controllers: [],
  providers: [AppService],
}) //http://localhost:5000/api
export class AppModule {}
