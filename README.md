Crafted
===

This repository is an Angular monorepo consisting of the following projects:

- **data** - A library package that makes it simple to configure and perform filtering, sorting, grouping, and viewing of data.
- **components** - A library package made up of Angular components used to manipulate and view data.
- **github-dashboard** - An Angular application that downloads GitHub data to the browser to perform quick exploration over issues and pull requests. 
- **docs** - An Angular application that showcases the use of the `data` and `components` library.

# Running the GitHub Dashboard app

Follow these instructions to run the GitHub Dashboard app:

1. Fork and clone the repository to your local machine

2. Install dependencies: `npm i`

4. Build repository packages: `npm run build-all`

5. Start the app: `ng serve`

6. Navigate to http://localhost:4200

### Optional: Enable GitHub login

The app calls the GitHub API to retrieve repository information. The API has much higher rate limits for authenticated usage.

To enable GitHub login on the app, you need to provide a configuration for a Firebase project.

1. Create a new project at https://console.firebase.google.com/

2. Follow steps to start a new web app and retrieve a firebase config. 
    
3. Store this config in `projects/github-dashboard/src/app/firebase.config.ts`. 

    For example:

    ```ts
    export const FIREBASE_CONFIG = {
        apiKey: "AIzaGyCyR3UgWIxHg4CGOFJ0r7Ev9JPFm2pIaGI",
        authDomain: "my-new-web-app.firebaseapp.com",
        databaseURL: "https://my-new-web-app.firebaseio.com",
        projectId: "my-new-web-app",
        storageBucket: "",
        messagingSenderId: "856194761032",
        appId: "1:856194761032:web:3da6h0b1e69cd32e"
    };
    ```

4. Follow these instructions to set up GitHub authentication in your Firebase app: https://firebase.google.com/docs/auth/web/github-auth

    - In short: turn on GitHub authentication in Firebase, [register a new app on GitHub](https://github.com/settings/applications/new), provide the GitHub app's client ID and secret to the Firebase app.

To verify that everything has been set up, you should now be able to log in to GitHub from the bottom of the left nav.
