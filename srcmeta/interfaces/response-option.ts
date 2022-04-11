// import { Document } from 'mongoose';
import { Pagination, QueryParser } from '../_shared/common';
import { MailOption } from '.';

export interface ResponseOption {
  value?: any | Document;
  code: number;
  model?: any;
  queryParser?: QueryParser;
  pagination?: Pagination;
  hiddenFields?: string[];
  message?: string;
  count?: number;
  token?: string;
  filterQuery?: Record<any, unknown>;
  email?: MailOption;
}
