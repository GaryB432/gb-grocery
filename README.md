# gb-grocery

It's a [grocery list web app](https://bortosky.com/mobile/grocery) for your cellphone.

# Getting Started

## Dependencies

[Angular CLI](https://cli.angular.io/)

## Installing

* `fork` this repo
* `clone` your fork
* `npm install` to install all dependencies

## Running the app

After you have installed all dependencies you can now run the app with:

```bash
npm start
```
go to [http://localhost:8080](http://localhost:4200) in your browser.

### Build files

* build files and watch: `ng serve`

## Testing

#### 1. Unit Tests

* single run: `ng test --single-run`
* live mode (TDD style): `ng test`

#### 2. End-to-End Tests (aka. e2e, integration)

TBD

## Data

| FB | LS | Start up action |
|:--:|:--:|---------------------------------------------|
| Y | Y | LS is a backup. |
| Y | N | LS is a backup. Save FB on LS. |
| N | Y | Maybe a new phone user. Save LS to FB. The people sharing this device only have one LS bucket so it will be overwritten but it is just a backup so overwriting is OK. |
| N | N | New user, initialize FB and LS |
