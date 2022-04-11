import { BooksDao } from './main/books/dao/books.dao';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Neo4jService } from './neo4j/neo4j.service/neo4j.service';
import { ArtistDao } from './main/artist/dao/artist.dao';
import { AttributesDao } from './main/attributes/dao/attributes.dao';
import { CharacterDao } from './main/character/dao/character.dao';
import { GenreDao } from './main/genre/dao/genre.dao';
import { SceneDao } from './main/scene/dao/scene.dao';
import { SeriesDao } from './main/series/dao/series.dao';
import { UserDao } from './main/user/dao/user.dao';
import { SaleOptionDao } from './main/sale-option/dao/sale-option.dao';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly neo4jService: Neo4jService) {}

  async onModuleInit() {
    try {
      await GenreDao.initialize(this.neo4jService);
      await BooksDao.initialize(this.neo4jService);
      await AttributesDao.initialize(this.neo4jService);
      await ArtistDao.initialize(this.neo4jService);
      await CharacterDao.initialize(this.neo4jService);
      await SaleOptionDao.initialize(this.neo4jService);
      await UserDao.initialize(this.neo4jService);
      await SeriesDao.initialize(this.neo4jService);
      await SceneDao.initialize(this.neo4jService);
    } catch (e) {
      console.log(`Initialization error...`, e);
    }
  }
}
