# Postfix REST Server Control Panel

A web UI for controlling the [Postfix REST Server](https://github.com/lyubenblagoev/postfix-rest-server).

Built with React, React Router and Axios.

Set `REACT_APP_BACKEND_API_BASE_URL` (in `.env` or command line) to the base URL of the Postfix REST Server before running the app in development mode or building the app for production use. By default, it points to `localhost:8080`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.