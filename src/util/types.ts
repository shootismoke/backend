import { HawkResult } from './hawk';

/**
 * Shared context for Apollo Server.
 */
export interface ApolloContext {
  hawk: HawkResult | Error;
}
