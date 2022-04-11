import { Relationship } from './../../../interfaces/relationshipType';
import { RelationshipDirection } from '../../../../../../apps/service/src/interfaces/relationshipType';

export const populationSchema = {
  attribute: {},
  genre: {},
  series: {},
  saleOption: {},
  artist: {},
  book: {
    attribute: {
      relationship: RelationshipDirection.BACKWARD,
      relationshiplabel: Relationship.BELONGS_TO,
    },
    genre: {
      relationship: RelationshipDirection.FORWARD,
      relationshiplabel: Relationship.HAS_GENRE,
    },
    series: {
      relationship: RelationshipDirection.FORWARD,
      relationshiplabel: Relationship.BELONGS_TO,
    },
    saleOption: {
      relationship: RelationshipDirection.BACKWARD,
      relationshiplabel: Relationship.BOOK_ON_SALE,
    },
  },
  scene: {
    attribute: {
      relationship: RelationshipDirection.FORWARD,
      relationshiplabel: Relationship.BELONGS_TO,
    },
    book: {
      relationship: RelationshipDirection.FORWARD,
      relationshiplabel: Relationship.HAS_MANY,
    },
    artist: {
      relationship: RelationshipDirection.FORWARD,
      relationshiplabel: Relationship.HAS_MANY,
    },
  },
  user: {
    book: {
      relationship: RelationshipDirection.BACKWARD,
      relationshiplabel: Relationship.CREATED_BY,
    },
  },
};

export const nodeNames = {
  book: 'Book',
  scene: 'Scene',
  genre: 'Genre',
  attribute: 'Attribute',
  series: 'Series',
  saleOption: 'SaleOption',
};
