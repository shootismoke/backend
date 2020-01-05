import {
  historyItemSchema,
  linkSchema,
  measurementSchema,
  userSchema
} from '../schema';
import { historyItemTypeDefs } from './historyItem';
import { userTypeDefs } from './user';

export const typeDefs = [
  linkSchema,
  historyItemSchema,
  historyItemTypeDefs,
  measurementSchema,
  userSchema,
  userTypeDefs
];
