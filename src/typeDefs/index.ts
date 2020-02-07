import { linkSchema, userSchema } from '../schema';
import { userTypeDefs } from './user';

export const typeDefs = [linkSchema, userSchema, userTypeDefs];
