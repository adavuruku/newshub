export enum AttributeType {
  TEXT = 'text',
  INT = 'int',
}

export class Attribute {
  id: string;
  title: string;
  value: any;
  type: AttributeType;
  createdAt: Date;
  updatedAt: Date;
}
