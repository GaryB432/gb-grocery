// import {
//     BaseRequestOptions,
//     Response,
//     ResponseOptions,
//     ConnectionBackend,
//     Http
// } from 'angular2/http';

// import {
//     it,
//     expect,
//     describe,
//     beforeEachProviders,
//     inject,
//     injectAsync
// } from 'angular2/testing';

// import { Observable, Subscriber, ConnectableObservable } from "rxjs";
// import {MockBackend} from 'angular2/http/testing';
// import {provide} from 'angular2/core';

// import {Home} from "../../components/home/home";
// import {ItemsService} from "../../services/items/item-service";
// import {Item} from "../../datatypes/item";

// class MockItemService {
//     public getItems(): Observable<Item[]> {

//         // return new Observable<Item[]>(observer => this.itemsObserver = observer)
//         //     .startWith(this.items)
//         //     .share();

//         return new Observable<Array<Item>>((subscriber: Subscriber<Array<Item>>) => {
//             const result: Array<Item> = [1, 2].map(n => new Item(n.toString(), `item number ${n}`, n < 5));
//             subscriber.next(result);
//             subscriber.complete();
//         });
//     }
// };

// describe('Testing the Home service', () => {
//     beforeEachProviders(() => {
//         return [
//             MockBackend,
//             BaseRequestOptions,
//             Home,
//             provide(ItemService, { useClass: MockItemService }),
//         ]
//     });
//     it('should get items from item service', inject([Home, ItemService], (home: Home) => {
//         home.ngOnInit();
//         expect(home.items.length).toBe(2);
//     }));
// });
