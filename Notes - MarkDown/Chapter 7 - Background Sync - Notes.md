
# Chapter 7

## Background Sync

### IndexedDB
Location 3588

**Using this approach, we could replace code like:**

```js
const sendMessage = (subject, message) =>
  fetch('/new-message', {
    method: 'post',
    body: JSON.stringify({ subj: subject, msg: message }),
  });

const likePost = postId => fetch(`/like-post?id=${ postId }`);
```

**With something line the follwing:**

**OBS:**
* Functions are fake
  * addToObjectStore
  * getAllObjectFrom
  * deleteRequestFromQueue

We replace all requests to the network with code that stores objects representing those
requests in an object store named `request-queue`. _(Location 3614)_

```js
//
// JS at Browser
//
const triggerRequestQueueSync = () => {
  navigator.serviceWorker.ready.then(registration => {
    registration.sync.register('request-queue');
  });
};

const sendMessage = (subject, message) => {
  addToObjectStore('request-queue', {
    url: '/new-message',
    method: 'post',
    body: JSON.stringify({subj: subject, msg: message}),
  });

  triggerRequestQueueSync();
};

const likePost = postId => {
  addToObjectStore('request-queue', {
    url: `/like-post?id=${ postId }`,
    method: 'get'
  });

  triggerRequestQueueSync();
};


//
// JS at ServiceWorker
//
self.addEventListener('sync', event => {
  if (event.tag === 'request-queue') {
    event.waitUntil(() => {
      return getAllObjectFrom('request-queue')
        .then(requests => {
          return Promise.all(
            requests.map(req => {
              return fetch(req.url, {
                method: req.method,
                body: req.body,
              })
                .then(() => {
                  deleteRequestFromQueue(message); // returns a promise
                });
            })
          );
        });
    });
  }
});
```
Requests that complete successfully are removed from the IndexedDB queue (using **deleteRequestFromQueue()**).


