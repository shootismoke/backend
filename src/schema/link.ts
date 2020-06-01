import gql from 'graphql-tag';

export const linkSchema = gql`
	scalar Date

	type Query {
		_: Boolean
	}
	type Mutation {
		_: Boolean
	}
`;
