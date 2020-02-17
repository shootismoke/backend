/**
 * Script to generate the whole GraphQL schema of the backend. This .graphql
 * file will then be sent to Apollo Graph Manager.
 */

import { printSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import { typeDefs } from '../src/typeDefs';

console.log(printSchema(makeExecutableSchema({ typeDefs })));
