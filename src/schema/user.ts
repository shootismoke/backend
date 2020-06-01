import gql from 'graphql-tag';

export const userSchema = gql`
	enum Frequency {
		never
		daily
		weekly
		monthly
	}

	type Notifications {
		_id: ID!
		expoPushToken: ID!
		frequency: Frequency!
		timezone: String!
		universalId: String!
	}

	type User {
		_id: ID!
		expoInstallationId: ID!
		notifications: Notifications
	}

	input NotificationsInput {
		expoPushToken: ID!
		frequency: Frequency!
		timezone: String!
		universalId: String!
	}

	input CreateUserInput {
		expoInstallationId: ID!
	}

	input UpdateUserInput {
		notifications: NotificationsInput
	}
`;
