



self.addEventListener('sync', event => {
   console.log('Event: ', event);
});


self.registration.sync
  .register('hello-sync')
  .then(() => self.registration.sync.getTags())
  .then(tags => console.log(tags)); // Return: ["hello-sync"]

