import { nowApollo } from '../src/apollo';
import { chain, hawk } from '../src/util';

export default chain(hawk)(nowApollo({ server: { path: '/api/graphql' } }));
