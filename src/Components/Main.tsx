import * as MobileNet from '@tensorflow-models/mobilenet';
import { Alert, Badge } from 'elementz';
import { useEffect, useRef } from 'react';

import API from '../Helpers/api';
import { base64ToImageElement, capitalize, classNames, useMultiState } from '../Helpers/Functions';
import Gallery from './Gallery';
import Uploader from './Uploader';

interface MainState {
	image: HTMLImageElement | string,
	breedList: {
		[breed: string]: string[]
	},
	breedName: string,
	subBreedName: string,
	probability: number,
	isParsingBreed: boolean,
	isModelLoading: boolean
};

function Main() {

	const [state, setState] = useMultiState<MainState>({
		breedList: window.JSON.parse(
			window.localStorage.getItem('breedList') || '{}'
		),
		breedName: '',
		image: '',
		isModelLoading: true,
		isParsingBreed: false,
		probability: 0,
		subBreedName: ''
	});

	const Model = useRef<MobileNet.MobileNet | null>(null);

	// Get the breed name that matches a keyword from the prediction className
	const matchDogBreed = (
		predictions: Array<{
			className: string;
			probability: number;
		}>
	): [breed: string, subBreed: string, probability: number] => {

		// Filter generic prediction keywords
		const filterKeywords = ["dog"];

		const formattedPredictions = predictions.map(
			(prediction): [string[], number] => ([
				prediction.className.
					replace(" ", ",").
					split(",").
					filter((keyword) => !~filterKeywords.indexOf(keyword) && keyword.trim()),
				prediction.probability
			])
		);

		const keywordMatcher = (breeds: string[]): [string, number] => {
			for (const prediction of formattedPredictions) {
				const [keywords, probability] = prediction;

				for (const keyword of keywords) {
					const matches = breeds.find((breed) => (
						breed.includes(keyword.toLowerCase())
					));

					if (matches) {
						return [matches, probability];
					}
				}
			}

			return ['', 0];
		};

		const [mainBreed, probability] = keywordMatcher(Object.keys(state.breedList));
		const [subBreed] = mainBreed ? keywordMatcher(state.breedList[mainBreed]): [''];

		return [mainBreed, subBreed, probability];
	}

	// Load things on first render
	useEffect(() => {

		// Load MobileNet Model
		MobileNet.load().then((model) => {
			Model.current = model;
			setState({
				isModelLoading: false
			});
		})

		// Refresh Dog Breed List Cache
		API.dogCeo.list()
			.then((res) => {
				setState({
					breedList: res.message
				});
				window.localStorage.setItem('breedList', JSON.stringify(res.message));
			})
			.catch((error: Error) => {
				// If there is no cache and request failed show error
				if (Object.keys(state.breedList).length === 0) {
					Alert.danger(error.message || "Something went wrong");
				}
			});

	}, []);

	// Find Breed on image change
	useEffect(() => {

		setState({
			isParsingBreed: true
		});

		if (state.image) {
			const imageElement = state.image instanceof HTMLImageElement ?
				state.image :
				base64ToImageElement(state.image);

			Model.current?.classify(imageElement)
				.then((result) => {
					const [breed, subBreed, probability] = matchDogBreed(result);

					setState({
						breedName: breed,
						probability,
						subBreedName: subBreed
					});

					if (!breed) {
						return Promise.reject();
					}
				})
				.catch(() => (
					Alert.warning("Your doggo is unique! We couldn't find any similar doggos")
				))
				.then(() => (
					setState({
						isParsingBreed: false
					})
				));
		}
	}, [state.image]);


	const emptyClassName = classNames('empty', {
		'disabled': state.isModelLoading
	});

	const className = classNames("header", {
		"loading": state.isModelLoading
	});

	const renderBreedName = capitalize(
		`${state.subBreedName ? `${state.subBreedName} ` : ''}${state.breedName}`
	);

	const renderProbability = state.probability ? (
		<Badge
			sm
			success
			warning={state.probability < 0.5}
			className='probability'>
			{`${Math.round(state.probability * 100).toString()}%`}
		</Badge>
	) : null;

	const renderEmpty = (
		<div className={emptyClassName}>
			<img src='/logo.png' />
			<h1>Find your dog breed & view his relatives</h1>
			<h3>Upload a picture of your dog or select a sample below</h3>
			<div className='samples'>
				{
					[
						'/golden.jpg',
						'/rottweiler.jpg',
						'/akita.png',
						'/prancer.jpg'
					].map((sample, i) => (
						<div className='sample' key={i}>
							<img
								src={sample}
								onClick={(e) => (
									!state.isModelLoading && setState({
										image: e.currentTarget
									})
								)}
							/>
						</div>
					))
				}
			</div>
		</div>
	);

	return (
		<div className="main">
			<div className={className}>
				<h1 className='mb-10'>
					What's my dog breed?
				</h1>
				<h2 className='breed-name'>
					{renderBreedName}
					{renderProbability}
				</h2>
				<div
					className="upload"
					title={state.isModelLoading ?
						"Loading AI model..." :
						"Upload a picture of your dog"
					}>
					<Uploader
						disabled={state.isModelLoading}
						image={state.image}
						onChange={(base64) => (
							setState({
								image: base64
							})
						)}
					/>
				</div>
				<a
					className="github"
					href="https://github.com/el1s7/DogFinder"
					target="_blank">
						<img src='/github.jpg' width='32px' />
						Star me on Github

				</a>
			</div>
			<div className="body">
				<Gallery
					breed={[
						state.breedName, state.subBreedName
					]}
					empty={
						renderEmpty
					}
				/>
			</div>

		</div>
	);
}

export default Main;
