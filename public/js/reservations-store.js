var DB_VERSION = 1;
var DB_NAME = "gih-reservations";

//
// Open Database
//
const openDatabase = () =>
  new Promise((resolve, reject) => {
    if (!self.indexedDB) {
      reject('IndexedDB not supported');
    }

    const request = self.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = event => reject(`Database error: ${event.target.error}`);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      const upgradeTransaction = event.target.transaction;
      let reservationsStore = null;

      if (!db.objectStoreNames.contains('reservations')) {
        reservationsStore = db.createObjectStore('reservations', { keyPath: 'id' });
      } else {
        reservationsStore = upgradeTransaction.objectStore('reservations');
      }

      if (!reservationsStore.indexNames.contains('idx_status')) {
        reservationsStore.createIndex('idx_status', 'status', { unique: false });
      }
    };

    request.onsuccess = event => resolve(event.target.result);
  });


//
// Open Object Store
//
const openObjectStore = (db, storeName, transactionMode) => db.transaction(storeName, transactionMode).objectStore(storeName);


//
// Add to Object Store
//
const addToObjectStore = (storeName, object) =>
  new Promise((resolve, reject) => {
    openDatabase()
      .then(db => {
        openObjectStore(db, storeName, 'readwrite').add(object).onsuccess = resolve;
      })
      .catch(errorMessage => {
        reject(errorMessage);
      });
  });

//
// Update in Object Store
//
const updateInObjectStore = (storeName, id, object) =>
  new Promise((resolve, reject) => {
    openDatabase()
      .then(db => {
        openObjectStore(db, storeName, 'readwrite').openCursor().onsuccess = event => {
          const cursor = event.target.result;

          if (!cursor) {
            reject('Reservation not found in object store');
          }

          if (cursor.value.id === id) {
            cursor.update(object).onsuccess = resolve;
            return;
          }

          cursor.continue();
        };
      })
      .catch(errorMessage => {
        reject(errorMessage);
      });
  });

//
// Get Reservations
//
const getReservations = (indexName, indexValue) =>
  new Promise(resolve => {
    openDatabase()
      .then(db => {
        const objectStore = openObjectStore(db, "reservations");
        const reservations = [];
        let cursor = null;

        if (indexName && indexValue) {
          cursor = objectStore.index(indexName).openCursor(indexValue);
        } else {
          cursor = objectStore.openCursor();
        }

        cursor.onsuccess = event => {
          const cursor = event.target.result;

          if (cursor) {
            reservations.push(cursor.value);
            cursor.continue();
          } else {
            if (reservations.length) {
              resolve(reservations);
            } else {
              getReservationsFromServer()
                .then(reservations => {
                  openDatabase().then(db => {
                    const objectStore = openObjectStore(db, 'reservations', 'readwrite');

                    reservations.forEach(reservation => objectStore.add(reservation));

                    resolve(reservations);
                  });
                });
            }
          }
        };
      }).catch(() => {
        getReservationsFromServer().then(reservations => resolve(reservations));
      });
  });


//
// Get Reservations from Server
//
const getReservationsFromServer = () =>
  new Promise(resolve => {
    fetch("/reservations.json")
      .then(response => response.json())
      .then(reservations => resolve(reservations));
  });



/**

Page's eBook: location 2934

Execute:
 addToObjectStore('reservations', { id: 123, nights: 2, guests: 2})

*/
