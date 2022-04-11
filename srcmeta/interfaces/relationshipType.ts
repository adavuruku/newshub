export enum Relationship {
  HAS_ONE = 'HAS_ONE',
  HAS_MANY = 'HAS_MANY',
  BELONGS_TO = 'BELONGS_TO',
  BOOK_ON_SALE = 'BOOK_ON_SALE',
  HAS_GENRE = 'HAS_GENRE',
  CREATED_BY = 'CREATED_BY',
}

export enum RelationshipDirection {
  FORWARD = '->',
  BACKWARD = '<-',
  BOTH = '-',
}

export interface RelationshipType {
  type: Relationship;
  direction?: RelationshipDirection;
  attributes?: Record<string, any>;
}
