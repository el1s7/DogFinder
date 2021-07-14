# DogFinder

Find dog breed family and view similar photos, powered by TensorflowJS.

This project was made as an assignment for https://ridedott.com/

## Design Choices

#### UI

The UI is simple, responsive and looks nice.

I decided to go with a Masonry layot for displaying gallery images since it
looks cooler and preserves the image height.

#### Dependencies

Both are my own libraries:

-   https://github.com/elementz-ui/elementz an UI library, used for Input
    element, Icons and Spinner.
-   https://github.com/el1s7/rested an API manager module.

## Installation

The first step is to clone this repository and run `yarn install`

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best
performance.
