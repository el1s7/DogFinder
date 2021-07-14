import { Alert, Icon, Input } from 'elementz';
import React from 'react';

import { fileToBase64 } from '../Helpers/Functions';

function Uploader(props: {
	image: HTMLImageElement | string,
	onChange: (base64: string) => void,
	disabled?: boolean
}) {

	const [image, setImage] = [
		props.image instanceof HTMLImageElement ?
			props.image.getAttribute('src') ?? '' :
			props.image,
		props.onChange
	];

	const handleError = () => {
		setImage('');
		Alert.warning('The image file looks invalid');
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files?.length) {
			return false;
		}

		const file: Blob = e.target.files[0];

		fileToBase64(file).then((base64: ArrayBuffer | string | null) => {
			if (typeof base64 !== 'string') {
				return Promise.reject();
			}

			setImage(base64);
		}).catch(() => (
			Alert.warning("Failed to process image")
		))
	};

	const uploadWrapper = (
		<div className="upload-wrapper upload-overlay">
			<img
				src={image}
				alt="Your dog"
				onError={handleError}
			/>
		</div>
	);

	const uploadEmpty = (
		<div className="upload-empty">
			<Icon name="cloud-upload" />
		</div>
	);

	const uploadBody = image === '' ?
		uploadEmpty :
		uploadWrapper;

	return (
		<Input
			full
			containerClassName="h-100"
			type="file"
			disabled={props.disabled}
			onChange={handleChange}
		>
			{uploadBody}
		</Input>
	);
}

export default Uploader;
