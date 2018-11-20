
# The IndexedDB Ecosystem 
Location of eBook 3254

## PouchDB
Link: https://pouchdb.com/

PouchDB was inspired by the CouchDB database and easily integrates with it so that yout apps can sync data back and
forth between the browser and the server

PouchDB uses IndexedDB, and falls back to Web SQL (an old, adabndoned API that is still supported in many browsers)
if IndexedDB support is not available or lacking:

```js
const db = new PouchDB('reservations-db');

db.put({
  _id: 1,
  nights: 3,
  guests: 2
});

db.changes().on('change', () => {
  console.log('Reservations database changed');
});

db.replicate.to('https://db.gothamimperiacal.com/mydb');

```

## localForage
Link: https://localforage.github.io/localForage/

localForage is a JavaScript database in the browser that uses a localStorage style API (supporting both callbacks and promises) to
simplify the creation of offline apps.

It relies on IndexedDB or WebSQL, falling back to localStorage in older browsers:

```js
const id = 1;

localforage
  .setItem(id, { nights: 3, guests: 2 })
  .then(() => {
    return localforage.getItem(id);
  })
  .then(reservation => {
    console.log(`Reservation ${id} is for ${reservation.nights} nights`);
  });
```

## Dexie.js 
Link: https://dexie.org/

Dexie.js is a wrapper for IndexedDB that improves on the IndexedDB developer in a number of ways, including an elegant
API, easier querying, and improved error handling:

```js
const db = new Dexie('reservations');

// Define a schema
db.version(1).stores({
  reservations: '++id, nights, guests',
});

db.open();

db.reservations
  .where('guests')
  .above(8)
  .each(reservation => {
    console.log(`Reservation ${reservation.id} for ${reservation.nights} nights`);
  });
```

### IndexedDB Promised
Link: https://github.com/jakearchibald/idb

IndexedDB Promised is a tiny wrapper library created with goal of improving the experience of using IndexedDB. 
It's simple enough that its four-word slogan captures exactly what it does: "IndexedDB, but with promises":

```js

idb.open('reservations', 1, upgradeDB => {
  return upgradeDB.createObjectStore('reservations');
})
  .then(db => {
    return db.transaction('reservations').objectStore('reservations').get(1);
  })
  .then(reservation => {
    console.log(`Reservation for ${reservation.nights} nights`);
  });
```
