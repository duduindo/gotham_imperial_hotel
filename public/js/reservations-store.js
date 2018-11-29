const DB_VERSION = 1;
const DB_NAME = 'gih-reservations';


const openDatabase = () =>
  new Promise((resolve, reject) => {
    if (!window.indexedDB)
      reject('IndexedDB not supported');

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = event => reject(`Database error: ${ event.target.error }`);

    request.onupgradeneeded = event => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('reservations'))
        db.createObjectStore('reservations', { keyPath: 'id' });
    };

    request.onsuccess = event => resolve(event.target.result);
  });


const openObjectStore = (db, storeName, transactionMode) =>
  db
    .transaction(storeName, transactionMode)
    .objectStore(storeName);


const addToObjectStore = (storeName, object) =>
  new Promise((resolve, reject) => {
    openDatabase()
      .then(db => {
        openObjectStore(db, storeName, 'readwrite').add(object).onsuccess = resolve;
      })
      .catch(errorMessage => reject(errorMessage));
  });


const updateInObjectStore = (storeName, id, object) =>
  new Promise((resolve, reject) => {
    openDatabase()
      .then(db => {
        openObjectStore(db, storeName, 'readwrite').openCursor()
          .onsuccess = event => {
            const cursor = event.target.result;

            if (!cursor)
              reject('Reservation not found in object store');

            if (cursor.value.id === id) {
              cursor.update(object).onsuccess = resolve;
              return;
            }

            cursor.continue();
          };
      })
      .catch(errorMessage => reject(errorMessage));
  });


const getReservations = () =>
  new Promise(resolve => {
    openDatabase().then(db => {
      const objectStore = openObjectStore(db, 'reservations', 'readonly');
      const reservations = [];

      objectStore.openCursor()
        .onsuccess = event => {
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
                  openDatabase()
                    .then(db => {
                      const objectStore = openObjectStore(db, 'reservations', 'readwrite');

                      reservations.forEach(item => objectStore.add(item));
                      resolve(reservations);
                    });
                });
            }

          }
        };
    });
  });

const getReservationsFromServer = () => new Promise(resolve => $.getJSON('/reservations.json', resolve));
