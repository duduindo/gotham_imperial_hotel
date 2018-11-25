self.addEventListener('sync', event => {
  if (event.tag === 'send-messages') {
    event.waitUntil(() => {
      const sent = sendMessages();

      if (sent)
        return Promise.resolve();
      else
        return Promise.reject();
    });
  }
});
