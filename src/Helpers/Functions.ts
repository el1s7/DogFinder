import{ useReducer } from 'react';

async function fileToBase64(file: Blob): Promise<ArrayBuffer | string | null> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.addEventListener('load', () => {
			resolve(reader.result);
		});
		reader.addEventListener('error', (error) => {
			reject(error);
		});
	});
}

function base64ToImageElement(base64: string): HTMLImageElement {
	const image = window.document.createElement('img');
	image.setAttribute('src', base64);

	return image;
}

type setStateParam<T> = Partial<T> | ((state: T) => Partial<T> | boolean | undefined);

function useMultiState<T extends object>(initialState: T): [
	T, (state: setStateParam<T>) => unknown
] {
	const [multiState, setMultiState] = useReducer(
		(state: T, action: setStateParam<T>) => {
			if (typeof action === "function") {
				const result = action(state);

				return {
					...state,
					...(result && typeof result === "object" ? result : {}),
				}
			}

			if (typeof action === "object") {
				return {
					...state,
					...action
				}
			}

			return state;
		}, initialState);

	return [multiState, setMultiState];
}

function capitalize(s: string) {
	return s.split(' ').map((str) => str.charAt(0).toUpperCase() + str.slice(1)).join(' ');
}

function classNames(...args: Array<string[] | boolean | string | {
	[classKey: string]: unknown
} | null | undefined>): string {

	let className: string[] = [];

	for(const cls of args){
		if(typeof cls === "string") {
			className.push(cls);
			continue;
		}

		if(Array.isArray(cls)) {
			className = className.concat(cls);
			continue;
		}

		if (cls && typeof cls === "object" ) {
			for (const classKey in cls) {
				if(!cls[classKey]) {
					continue;
				}

				className.push(classKey);
			}
		}
	}

	return className
		.map((x, i, self) => (self.indexOf(x) === i ? x.trim() : null))
		.filter((x) => x)
		.join(' ');
}

export { base64ToImageElement,capitalize,classNames, fileToBase64, useMultiState};
