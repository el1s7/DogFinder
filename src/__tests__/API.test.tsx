import { exception } from 'console';
import API from '../Helpers/api';

test('dog.ceo get breed images API is working', () => {
	expect.hasAssertions();

	return API.dogCeo.random({
		breed: 'retriever',
		subbreed: 'golden',
		limit: 5
	}).then(data => {
	  expect(data.status).toBe('success');
	  expect(data.message.length).toBe(5);
	});
});
