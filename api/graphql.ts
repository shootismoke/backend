import { nowApollo } from '../src/apollo';
import { sentrySetup } from '../src/util';

sentrySetup();

export default nowApollo({ server: { path: '/api/graphql' } });
