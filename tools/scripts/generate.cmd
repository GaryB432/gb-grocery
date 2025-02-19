ng g module shared
ng g module shared/geo
ng g module store
ng g module home
ng g module login
ng g guard shared/auth --implements CanActivate
ng g pipe shared/moment
ng g component about
ng g component checkout
ng g component home/home
ng g component home/home-item
ng g component item
ng g component login
ng g component store
ng g component store/pickup
ng g directive shared/HammerGestures -m shared
ng g service shared/data/data
ng g service shared/data/data-io --flat
ng g service shared/data/data-local-storage --flat
ng g service shared/geo/AbstractGeo --flat
ng g service shared/geo/GoogleGeo --flat
ng g service shared/geo/MockGeo --flat
ng g service shared/logic
ng g class models/appinfo --skip-tests
ng g class models/checkout --skip-tests
ng g class models/item --skip-tests
ng g class models/pickup --skip-tests
ng g class models/store --skip-tests
ng g class shared/data/dto --skip-tests
ng g class shared/geo/Photo --skip-tests
ng g class shared/geo/place --skip-tests
ng g class shared/geo/point --skip-tests
ng g class shared/utilities --skip-tests


npm install @types/google.maps -D
npm install @types/hammerjs -D
npm install eslint-plugin-gb -D
npm install @angular/fire firebase
npm install font-awesome
npm install hammerjs
npm install moment
npm install ngx-toaster
