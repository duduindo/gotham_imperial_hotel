



self.addEventListener('sync', event => {
  if (event.tag === 'add-reservation') {
    event.waitUntil(
      addReservation() // NOTE: addReservation only example. It doesn't exist
        .then(() => Promise.resolve())
        .catch(error => {
          if (event.lastChance) {
            return removeReservation();
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

