


/**
 * NOTE: addReservation only example. It doesn't exist
 */
self.addEventListener('sync', event => {
  if (event.tag === 'add-reservation') {
    event.waitUntil(
      addReservation() // eslint-disable-line no-undef
        .then(() => Promise.resolve())
        .catch(error => {
          if (event.lastChance) {
            return removeReservation(); // eslint-disable-line no-undef
          } else {
            return Promise.reject();
          }
        })
    );
  }

  console.log(event.lastChance); // TRUE or FALSE
});


self.registration.sync
  .register('hello-sync')
  .then(() => self.registration.sync.getTags())
  .then(tags => console.log(tags)); // Return: ["hello-sync"]

