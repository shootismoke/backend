/**
 * Script to generate the whole GraphQL schema of the backend. This .graphql
 * file will then be sent to Apollo Graph Manager.
 */

// Add external packages typings
// See https://github.com/TypeStrong/ts-node#help-my-types-are-missing
/// <reference types="../src/external" />

import { printSchema } from 'graphql';
import {
  IExecutableSchemaDefinition,
  makeExecutableSchema,
} from 'graphql-tools';

import { apolloServerConfig } from '../src/apollo';

console.log(
  printSchema(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    makeExecutableSchema(apolloServerConfig as IExecutableSchemaDefinition<any>)
  )
);
