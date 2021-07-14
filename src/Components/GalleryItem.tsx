import { Icon } from 'elementz';
import { useState } from 'react';

import { classNames } from '../Helpers/Functions';

const GalleryItem = function (props: {
	image: string
}) {

	const [preview, setPreview] = useState(false);

	const className = classNames('gallery-item', {
		preview
	})

	return (
		<div
			className={className}>
			<div
				className='gallery-image'
				onClick={() => { setPreview(true); }}>
				<img
					loading='lazy'
					src={props.image}
					alt='A dog'
				/>
			</div>

			<div
				className='preview-container'
				onClick={(e) => {
					e.target === e.currentTarget && setPreview(false);
				}}>
				<img
					src={props.image}
					alt='A dog'
				/>
				<div
					className='preview-close'
					onClick={() => { setPreview(false); }}>
					<Icon name='close' />
				</div>
			</div>

		</div>
	)
};

export default GalleryItem;
