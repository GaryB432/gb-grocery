// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  firebase: {
    apiKey: 'AIzaSyC15lGGff4ztkFBx2F4fGKyKo7TVUHDpnE',
    authDomain: 'grocery-dev-3b673.firebaseapp.com',
    databaseURL: 'https://grocery-dev-3b673.firebaseio.com',
    messagingSenderId: '812997008154',
    projectId: 'grocery-dev-3b673',
    storageBucket: 'grocery-dev-3b673.appspot.com',
  },
  buildStamp: '1980-01-01T06:00:01.000Z',
  production: false,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error'; // Included with Angular CLI.
