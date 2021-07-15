import { exception } from 'console';

import API from '../Helpers/api';

it('dog.ceo get breed images API is working', async () => {
	expect.hasAssertions();

	// eslint-disable-next-line jest/no-test-return-statement
	return API.dogCeo.random({
		breed: 'retriever',
		limit: 5,
		subbreed: 'golden'
	}).then(data => {
		expect(data.status).toBe('success');
		expect(data.message).toHaveLength(5);
	})
});
