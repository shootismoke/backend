import { ALICE_ID, CREATE_USER, describeApollo } from '../../util';

const ALICE = {
	expoInstallationId: ALICE_ID,
};

describeApollo('users::createUser', (client) => {
	it('should always require input', async (done) => {
		const { mutate } = await client;

		const res = await mutate({
			mutation: CREATE_USER,
			variables: {},
		});

		expect(res.errors && res.errors[0].message).toBe(
			'Variable "$input" of required type "CreateUserInput!" was not provided.'
		);

		done();
	});

	it('should require expoInstallationId', async (done) => {
		const { mutate } = await client;

		const res = await mutate({
			mutation: CREATE_USER,
			variables: { input: {} },
		});

		expect(res.errors && res.errors[0].message).toBe(
			'Variable "$input" got invalid value {}; Field expoInstallationId of required type ID! was not provided.'
		);

		done();
	});

	it('should create a user', async (done) => {
		const { mutate } = await client;

		const res = await mutate({
			mutation: CREATE_USER,
			variables: { input: ALICE },
		});

		if (!res.data) {
			return done.fail('No data in response') as void;
		}

		expect(res.data.createUser._id).toBeDefined();
		expect(res.data.createUser).toMatchObject(ALICE);

		done();
	});

	it('should validate unique expoInstallationId', async (done) => {
		const { mutate } = await client;

		const res = await mutate({
			mutation: CREATE_USER,
			variables: { input: ALICE },
		});

		expect(res.errors && res.errors[0].message).toBe(
			'E11000 duplicate key error dup key: { : "id_alice" }'
		);

		done();
	});
});
