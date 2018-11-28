

const openDatabase = () => {
	// Make sure IndexedDB is supported before attempting to use it
	if (!window.indexedDB)
		return false;

	const request = window.indexedDB.open('gih-reservations', 1);

	request.onupgradeneeded = event => {
		const db = event.target.result;

		if (!db.objectStoreNames.contains('reservations'))
			db.createObjectStore('reservations', { keyPath: 'id' });
	};

	return request;
};


const openObjectStore = (storeName, successCallback, transactionMode) => {
	let openDb = openDatabase();

	if (!openDb)
		return false;

	openDb.onsuccess = event => {
		const db = event.target.result;
		const objectStore = db
			.transaction(storeName, transactionMode)
			.objectStore(storeName);

		successCallback(objectStore);
	};

	return true;
};


const getReservations = successCallback => {
  const reservations = [];
  const db = openObjectStore('reservations', objectStore => {
    objectStore.openCursor().onsuccess = event => {
      const cursor = event.target.result;

      if (cursor) {
        reservations.push(cursor.value);
        cursor.continue();
      } else {
        if (reservations.length) {
          successCallback(reservations);
        } else {
          $.getJSON('/reservations.json', reservations => {
            openObjectStore('reservations', reservationsStore => {
              reservations.forEach(item => reservationsStore.add(item));

              successCallback(reservations);
            }, 'readwrite');
          });
        }
      }
    };
  });

  if (!db) {
    $.getJSON('/reservations.json', successCallback);
  }
};


const addToObjectStore = (storeName, object) =>
  openObjectStore(storeName, store => store.add(object), 'readwrite');


const updateInObjectStore = (storeName, id, object) => {
  openObjectStore(storeName, objectStore => {
    objectStore.openCursor().onsuccess = event => {
      const cursor = event.target.result;

      if (!cursor) return;

      if (cursor.value.id === id) {
        cursor.update(object);
        return;
      }

      cursor.continue();
    };
  }, 'readwrite');
};


