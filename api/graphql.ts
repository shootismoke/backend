import { init } from '@sentry/node';

import { nowApollo } from '../src/apollo';
import { chain, hawk, noopMiddleware } from '../src/util';

if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN
  });
}

export default chain(
  process.env.NODE_ENV === 'production' ? hawk : noopMiddleware
)(nowApollo({ server: { path: '/api/graphql' } }));
