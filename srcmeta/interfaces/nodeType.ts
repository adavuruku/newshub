import { RelationshipType } from './relationshipType';

export interface NodeType {
  id: string;
  label: string;
  attributes?: Record<string, any>;
  relation?: RelationshipType;
  tag?: string;
}
