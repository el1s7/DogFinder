import Rested from "wrape";

interface BreedResponse<T> {
	message: T,
	status: "error" | "success"
}

interface RestedObject {
	dogCeo: {
		list: () => Promise<BreedResponse<
			{ [breed: string]: string[] }
			>>,
		random: (params: {
			breed: string,
			limit: number,
			subbreed?: string,
		})=> Promise<BreedResponse<string[]>>,
	}
}

const formatResponse = (res: {
	headers: object,
	status: number | string,
	statusText: string,
	status_code: number | string,
	json?: object | null,
	text?: string,
	message?: string
}) => {
	if (!res.json) {
		return Promise.reject(
			new Error("Bad response")
		)
	}

	return res.json;
};

const endpoints = {
	dogCeo: {
		$options: {
			base: 'https://dog.ceo/api'
		},
		list: {
			path: '/breeds/list/all',
			response: formatResponse
		},
		random: {
			params: {
				breed: {
					location: 'path',
					required: true
				},
				limit: {
					location: 'path',
					required: true,
					validate: '^[0-9]+$'
				},
				subbreed: {
					default: '',
					format: (subbreed: string) => (
						subbreed ? `/${  subbreed}` : ''
					),
					location: 'path',
					required: false
				}
			},
			path: '/breed/:breed:subbreed/images/random/:limit',
			response: formatResponse
		}
	}
};

const API: RestedObject = Rested(endpoints);

export default API;
