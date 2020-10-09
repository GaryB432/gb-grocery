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
  azure: {
    INPUT_ACTION: 'INPUT_ACTION',
    INPUT_APP_BUILD_COMMAND: 'INPUT_APP_BUILD_COMMAND',
    INPUT_APP_LOCATION: 'INPUT_APP_LOCATION',
    INPUT_API_LOCATION: 'INPUT_API_LOCATION',
    INPUT_APP_ARTIFACT_LOCATION: 'INPUT_APP_ARTIFACT_LOCATION',
    INPUT_API_BUILD_COMMAND: 'INPUT_API_BUILD_COMMAND',
    INPUT_ROUTES_LOCATION: 'INPUT_ROUTES_LOCATION',
    HOME: 'HOME',
    GITHUB_JOB: 'GITHUB_JOB',
    GITHUB_REF: 'GITHUB_REF',
    GITHUB_SHA: 'GITHUB_SHA',
    GITHUB_REPOSITORY: 'GITHUB_REPOSITORY',
    GITHUB_REPOSITORY_OWNER: 'GITHUB_REPOSITORY_OWNER',
    GITHUB_RUN_ID: 'GITHUB_RUN_ID',
    GITHUB_RUN_NUMBER: 'GITHUB_RUN_NUMBER',
    GITHUB_RETENTION_DAYS: 'GITHUB_RETENTION_DAYS',
    GITHUB_ACTOR: 'GITHUB_ACTOR',
    GITHUB_WORKFLOW: 'GITHUB_WORKFLOW',
    GITHUB_HEAD_REF: 'GITHUB_HEAD_REF',
    GITHUB_BASE_REF: 'GITHUB_BASE_REF',
    GITHUB_EVENT_NAME: 'GITHUB_EVENT_NAME',
    GITHUB_SERVER_URL: 'GITHUB_SERVER_URL',
    GITHUB_API_URL: 'GITHUB_API_URL',
    GITHUB_GRAPHQL_URL: 'GITHUB_GRAPHQL_URL',
    GITHUB_WORKSPACE: 'GITHUB_WORKSPACE',
    GITHUB_ACTION: 'GITHUB_ACTION',
    GITHUB_EVENT_PATH: 'GITHUB_EVENT_PATH',
    GITHUB_PATH: 'GITHUB_PATH',
    GITHUB_ENV: 'GITHUB_ENV',
    RUNNER_OS: 'RUNNER_OS',
    RUNNER_TOOL_CACHE: 'RUNNER_TOOL_CACHE',
    RUNNER_TEMP: 'RUNNER_TEMP',
    RUNNER_WORKSPACE: 'RUNNER_WORKSPACE',
    ACTIONS_RUNTIME_URL: 'ACTIONS_RUNTIME_URL',
    ACTIONS_RUNTIME_TOKEN: 'ACTIONS_RUNTIME_TOKEN',
    ACTIONS_CACHE_URL: 'ACTIONS_CACHE_URL',
  },
  production: false,
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
