import React from 'react';
import renderer from 'react-test-renderer';

import Uploader from './../Components/Uploader';

it('renders correctly empty uploader', () => {
	expect.hasAssertions();

	const component = renderer
		.create(
			<Uploader image='' onChange={() => null}/>
		)

	const tree = component.toJSON();

	expect(tree).toMatchSnapshot();
});

it('renders correctly uploaded image', () => {
	expect.hasAssertions();

	const component = renderer
		.create(
			<Uploader image='/akita.jpg' onChange={() => null}/>
		)

	const tree = component.toJSON();

	expect(tree).toMatchSnapshot();
});
