import { nowApollo } from '../src/apollo';
import { sentrySetup } from '../src/util';

sentrySetup();

export default nowApollo({
  db: {
    uri: process.env.MONGODB_ATLAS_URI
  },
  server: { path: '/api/graphql' }
});
