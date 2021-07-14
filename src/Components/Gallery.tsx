import { Alert, Loading } from 'elementz';
import { useEffect, useRef } from 'react';
import Masonry from 'react-masonry-css'

import API from '../Helpers/api';
import { useMultiState } from '../Helpers/Functions';
import GalleryItem from './GalleryItem';

interface GalleryState {
	images: string[],
	limit: number,
	scrollEnd: boolean,
	isWaterfall: boolean,
	isFetching: boolean
}


function Gallery(props: {
	breed: string[],
	empty: JSX.Element,
	// Add initial images for unit-tests
	initialImages?: string[]
}) {

	const [breed, subBreed] = props.breed;

	const [state, setState]= useMultiState<GalleryState>({
		images: props.initialImages || [],
		isFetching: false,
		isWaterfall: true,
		 // Fetch more items depending on screen width
		limit: Math.floor(window.innerWidth * 0.03),
		scrollEnd: true
	});

	const lastBreed = useRef(breed + subBreed);

	const handleScroll = () => {
		const scrollCurrentPosition = (document.documentElement.scrollTop + (document.documentElement.clientHeight * 1.7));
		const scrollTotalHeight = document.documentElement.scrollHeight
		const isScrollFinished = scrollCurrentPosition >= scrollTotalHeight;

		if (isScrollFinished) {
			setState({
				scrollEnd: true
			});
		}
	}

	// Add Scroll Listener
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		}
	}, []);

	// Reset Gallery on Breed Change
	useEffect(() => {
		if (!breed || (lastBreed.current !== (breed + subBreed))) {
			setState({
				images: [],
				scrollEnd: true,
			});
		}

		lastBreed.current = (breed + subBreed);
	}, [breed, lastBreed]);

	// Get Images
	useEffect(() => {
		if (breed && state.scrollEnd) {
			setState({
				isFetching: true
			});

			API.dogCeo.random({
				breed,
				limit: state.limit,
				subbreed: subBreed,
			})
				.then((res) => {
					setState((currentState) => ({
						images: [
							...currentState.images,
							...res.message
						]
					}));
				})
				.catch(() => {
					Alert.danger("Failed loading doggos ¯\\_(ツ)_/¯");
				})
				.then(() => (
					setState({
						isFetching: false,
						scrollEnd: false
					})
				));

		}

	}, [breed, subBreed, state.scrollEnd, state.limit])

	const renderTitle = (
		<h2 className='mb-20 ez-text'>
			Here are some more doggos like yours
		</h2>
	);

	const renderSpinner = (
		<div className='spinner'>
			<Loading lg secondary />
		</div>
	);

	return state.images.length > 0 ? (
		<>
			{renderTitle}
			<Masonry
				breakpointCols={{
					1100: 3,
					1600: 4,
					2000: 5,
					2500: 6,
					500: 1,
					700: 2,
					default: 3
				}}
				className="gallery"
				columnClassName="gallery-column"
			>
				{
					state.images.map((image, i) => (
						<GalleryItem
							image={image}
							key={i.toString() + breed + subBreed}
						/>
					))
				}
			</Masonry>
			{state.isFetching && renderSpinner}
		</>
	) : (
		state.isFetching ? renderSpinner : props.empty
	);
}

export default Gallery;
