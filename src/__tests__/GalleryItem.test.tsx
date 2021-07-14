import React from 'react';
import renderer from 'react-test-renderer';

import GalleryItem from './../Components/GalleryItem';

it('renders gallery item correctly', () => {
	expect.hasAssertions();

	const component = renderer
		.create(
			<GalleryItem image='/akita.jpg' />
		)

	const tree = component.toJSON();

	expect(tree).toMatchSnapshot();
});

