import { render, screen } from '@testing-library/react';
import React from 'react';
import renderer from 'react-test-renderer';

import Gallery from './../Components/Gallery';

it('gallery empty render correctly', () => {
	expect.hasAssertions();
	render(<Gallery
		breed={['', '']}
		empty={<span>This is empty</span>}
	/>);
	const emptyElement = screen.getByText(/this is empty/ui);
	expect(emptyElement).toBeInTheDocument();
});


it('gallery images render correctly', () => {
	expect.hasAssertions();

	const component = renderer
		.create(
			<Gallery
				breed={['', '']}
				empty={<span>Empty</span>}
				initialImages={[
					'/akita.png',
					'/rottweiler.jpg',
					'/golden.jpg',
					'/prancer.jpg'
				]}
			/>
		)

	const tree = component.toJSON();

	expect(tree).toMatchSnapshot();
});
