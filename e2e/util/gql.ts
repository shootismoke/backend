import { gql } from 'apollo-server-micro';

export const CREATE_USER = gql`
	mutation ($input: CreateUserInput!) {
		createUser(input: $input) {
			_id
			expoInstallationId
			notifications {
				_id
				expoPushToken
				frequency
				timezone
				universalId
			}
		}
	}
`;

export const GET_USER = gql`
	query ($expoInstallationId: ID!) {
		getUser(expoInstallationId: $expoInstallationId) {
			_id
			expoInstallationId
			notifications {
				_id
				expoPushToken
				frequency
				timezone
				universalId
			}
		}
	}
`;

export const UPDATE_USER = gql`
	mutation ($expoInstallationId: ID!, $input: UpdateUserInput!) {
		updateUser(expoInstallationId: $expoInstallationId, input: $input) {
			_id
			expoInstallationId
			notifications {
				_id
				expoPushToken
				frequency
				timezone
				universalId
			}
		}
	}
`;
