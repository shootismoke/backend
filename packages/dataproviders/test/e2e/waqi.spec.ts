import { waqi } from '../../src/providers/waqi';
import { testProviderE2E } from '../../src/util';

describe('waqi e2e', () => {
	testProviderE2E(waqi, {
		skip: ['fetchByStation'],
	});
});
