import Sentry from '@sentry/node';

import { nowApollo } from '../src/apollo';
import { chain, hawk } from '../src/util';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN
  });
}

export default chain(hawk)(nowApollo({ server: { path: '/api/graphql' } }));
