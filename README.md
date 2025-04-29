# Getting Started with Create React App
## Prerequisites
* Node Package Manager
* AWS CLI
* AWS Sandbox account with technical user (non-root)
  * https://github.com/Alegres/awstraining-basics-hands-on?tab=readme-ov-file#create-non-root-user
  
## Initialization
Install AWS Amplify:

```bash
npm install -g @aws-amplify/cli
```

Run configure.
```bash
amplify configure
```

Signin to your AWS account (technical user).

Select region **eu-central-1** and follow further instruction:
* https://docs.amplify.aws/gen1/javascript/tools/cli/start/set-up-cli/#configure-the-amplify-cli

Go to IAM -> Users and create a new user. Name it **amplify-dev**. Do not grant access to the AWS Console.

Attach **AdministratorAccess-Amplify** to that user. Review and confirm user creation.

Then, click your new user name and go to **Security Credentials**. Create pair of access keys for the **Command Line Interface (CLI)**.

Save access & secret keys somewhere, so you do not loose access to them.

Press Enter in the bash console to continue.

Provide **accessKeyId** and **secretAccessKey**, and confirm. Provide profile name **amplify-user**.

Initialize new React app:
```bash
npx create-react-app amplify-app
cd amplify-app
```

Initialize app:
```bash
amplify init
```

Chooose Amplify Gen 1. Confirm with "Prefer not to answer".

Enter default name for the project.

Initialize the project with default configuration.

As authentication method choose AWS profile and select previously created **amplify-user** profile.

You can agree or disagree on Amplify improvements.

## Adding Cognito authentication
Add authentication module:
```bash
amplify add auth
```

Choose Cognito and create new users group. Call it **AmplifyUsers**.

In order to add authentication, Amplify will create a Cognito User Pool, that we will later link to our API Gateway (in the backend module).

Our **amplify-user** does not have the required permissions at first, therefore, please assign **AdministratorAccess** to that user for a moment.

Then, you can run the following command:
```bash
amplify push
```

Amplify will create Cognito User pool and link it with our application. Now you can remove the **AdministratorAccess** from the Cognito user.

**Now, we need to go to AWS console, and copy this pool's ARN, and set it inside our backend's stack.**

## Install Amplify UI React
Run:
```bash
npm install aws-amplify @aws-amplify/ui-react
```

Adjust ```amplify-app/src/index.js``` by adding **aws-exports:**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from "aws-amplify"; // Import Amplify
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

## Update main App.js
We will now create a login & registration form and call our API Gateway.

Go to ```src/App.js``` and implement the following code:
```javascript
import React, { useState } from "react";
import './App.css';
import Login from "./components/Login"; // Import Login component

const API_GATEWAY_URL = "https://uiqiygztmj.execute-api.eu-central-1.amazonaws.com/prod/hello";

const App = () => {
  const [token, setToken] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  const handleLogin = (authToken) => {
    setToken(authToken);
  };

  const callAPI = async () => {
    if (!token) {
      alert("Please log in first!");
      return;
    }

    try {
      const response = await fetch(API_GATEWAY_URL, {
        method: "GET",
        headers: {
          Authorization: token, // Pass Cognito token
        },
      });
      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  return (
    <div>
      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div>
          <h2>Welcome!</h2>
          <button onClick={callAPI}>Call API</button>
          {apiResponse && <pre>{JSON.stringify(apiResponse, null, 2)}</pre>}
        </div>
      )}
    </div>
  );
};

export default App;
```

Make sure to adjust the **API_GATEWAY_URL** and set it to your API Gateway deployed in the **backend** module.

## Deploy Frontend with AWS Amplify
Once everything is working, you can deploy your app to AWS.
```bash
amplify add hosting
```

Choose Amazon CloudFront & S3. Confirm default bucket name.

Then deploy:
```bash
amplify publish
```

## Known issues
If your app does not refresh after pushing the changes, then use **-c** flag to invalidate CloudFront cache:
```bash
amplify publish -c
```


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
