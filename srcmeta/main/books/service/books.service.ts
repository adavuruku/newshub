import { Relationship } from './../../../interfaces/relationshipType';
import { Neo4jService } from './../../../neo4j/neo4j.service/neo4j.service';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../core/_base';
import { BooksDao } from '../dao/books.dao';

@Injectable()
export class BooksService extends BaseService {
  public identifier = 'book';

  constructor(readonly neo4jService: Neo4jService) {
    super();
    this.dao = new BooksDao(this.neo4jService);
  }

  async create(payload: Record<string, any>) {
    const error = await this.validateCreate(payload);
    if (error) {
      return error;
    }
    const { saleOptions, series, attributes, genres, ...obj } = payload;
    const result = await this.dao.create(obj);
    let book = await this.dao.getData(result, []);
    const allSave = [];
    if (attributes && attributes.length > 0) {
      for (const attribute of attributes) {
        const t = this.createRelationship(
          {
            id: attribute,
            label: 'Attribute',
            attributes: { attribute_id: attribute },
          },
          {
            id: book.book_id,
            label: 'Book',
            attributes: { book_id: book.book_id },
          },
          {
            type: Relationship.BELONGS_TO,
          },
        );
        allSave.push(t);
      }
    }

    if (genres && genres.length > 0) {
      for (const genre of genres) {
        const j = this.createRelationship(
          {
            id: book.book_id,
            label: 'Book',
            attributes: { book_id: book.book_id },
          },
          { id: genre, label: 'Genre', attributes: { genre_id: genre } },
          {
            type: Relationship.HAS_GENRE,
            attributes: {},
          },
        );
        allSave.push(j);
      }
    }
    if (series && series.length > 0) {
      for (const s of series) {
        const sr = this.createRelationship(
          {
            id: book.book_id,
            label: 'Book',
            attributes: { book_id: book.book_id },
          },
          { id: s, label: 'Series', attributes: { series_id: s } },
          {
            type: Relationship.BELONGS_TO,
            attributes: {},
          },
        );
        allSave.push(sr);
      }
    }
    if (saleOptions && saleOptions.length > 0) {
      for (const saleOption of saleOptions) {
        const so = this.createRelationship(
          {
            id: book.book_id,
            label: 'Book',
            attributes: { book_id: book.book_id },
          },
          {
            id: saleOption.id,
            label: 'SaleOption',
            attributes: { saleOption_id: saleOption.id },
          },
          {
            type: Relationship.BOOK_ON_SALE,
            attributes: {
              typeSale: saleOption.SaleType,
            },
          },
        );
        allSave.push(so);
      }
    }

    if (allSave.length > 0) {
      await Promise.all(allSave);
    }

    const postData = await this.postCreateResponse(book);

    if (postData) {
      book = Object.assign({}, book, postData);
    }
    return book;
  }
}
