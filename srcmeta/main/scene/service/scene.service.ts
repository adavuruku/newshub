import {
  Relationship,
  RelationshipDirection,
} from './../../../interfaces/relationshipType';
import { SceneDao } from './../dao/scene.dao';
import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../../../service/src/core/_base';
import { Neo4jService } from '../../../../../service/src/neo4j/neo4j.service/neo4j.service';

@Injectable()
export class SceneService extends BaseService {
  public identifier = 'scene';

  constructor(readonly neo4jService: Neo4jService) {
    super();
    this.dao = new SceneDao(this.neo4jService);
  }

  async create(payload: Record<string, any>) {
    const error = await this.validateCreate(payload);
    if (error) {
      return error;
    }
    const { attributes, artists, book, ...obj } = payload;
    const result = await this.dao.create(obj);
    let scene = await this.dao.getData(result, []);
    const allSave = [];
    if (attributes && attributes.length > 0) {
      for (const attribute of attributes) {
        const attr = this.createRelationship(
          {
            id: attribute,
            label: 'Attribute',
            attributes: { attribute_id: attribute },
          },
          {
            id: scene.scene_id,
            label: 'Scene',
            attributes: { scene_id: scene.scene_id },
          },
          {
            type: Relationship.BELONGS_TO,
          },
        );
        allSave.push(attr);
      }
    }
    if (artists && artists.length > 0) {
      for (const artist of artists) {
        const art = this.createRelationship(
          {
            id: artist,
            label: 'Artist',
            attributes: { artist_id: artist },
          },
          {
            id: scene.scene_id,
            label: 'Scene',
            attributes: { scene_id: scene.scene_id },
          },
          {
            type: Relationship.HAS_MANY,
            direction: RelationshipDirection.FORWARD,
          },
        );
        allSave.push(art);
      }
    }
    if (book) {
      const sr = this.createRelationship(
        {
          id: scene.scene_id,
          label: 'Scene',
          attributes: { scene_id: scene.scene_id },
        },
        { id: book, label: 'Book', attributes: { book_id: book } },
        {
          type: Relationship.BELONGS_TO,
          attributes: {},
        },
      );
      allSave.push(sr);
    }

    if (allSave.length > 0) {
      await Promise.all(allSave);
    }

    const postData = await this.postCreateResponse(scene);

    if (postData) {
      scene = Object.assign({}, scene, postData);
    }
    return scene;
  }
}
