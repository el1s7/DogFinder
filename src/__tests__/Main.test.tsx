import React from 'react';
import renderer from 'react-test-renderer';

import Main from './../Components/Main';

it('main app renders correctly', () => {
	expect.hasAssertions();

	const component = renderer
		.create(
			<Main/>
		)

	const tree = component.toJSON();

	expect(tree).toMatchSnapshot();
});

