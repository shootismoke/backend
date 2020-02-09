import { init } from '@sentry/node';

import { nowApollo } from '../src/apollo';

if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN
  });
}

export default nowApollo({ server: { path: '/api/graphql' } });
