import { nowApollo } from '../apollo';
import { sentrySetup } from '../util';

sentrySetup();

export default nowApollo({
  db: {
    uri: process.env.MONGODB_ATLAS_URI
  },
  server: { path: '/api/graphql' }
});
