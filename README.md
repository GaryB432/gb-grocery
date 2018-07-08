# GbGrocery

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Docker noob notes

```cmd
docker ps -a
rem docker rm -f $(docker ps -a -q)
rem rm -rf node_modules
rem npm i && npm run build
rem ng build --prod
docker build -t gb-grocery:6.next .
docker images
docker run -d -p 8086:80 gb-grocery:6.next
docker ps -a
docker stop fb
rem docker pull garyb432/gb-grocery:4.4
docker tag garyb432/gb-grocery:6.next garyb432/gb-grocery:latest
```

Visit http://localhost:8086 for the nginx experience

See also deploy-azure.cmd

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Data

| FB (Firebase) | LS (LocalStorage) | Start up action |
|:--:|:--:|---------------------------------------------|
| Y | Y | LS is a backup. |
| Y | N | LS is a backup. Save FB on LS. |
| N | Y | Maybe a new phone user. Save LS to FB. The people sharing this device only have one LS bucket so it will be overwritten but it is just a backup so overwriting is OK. |
| N | N | New user, initialize FB and LS |
