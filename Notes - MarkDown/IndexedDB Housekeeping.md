
# IndexedDB Housekeeping 

* MDN 
 * https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist

If you want to make absolutely certain that data you save is never deleted automatically,
an experimental new API in Chrome and Open lets you ask the for persistent storage permissions:

```js

if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(persistent => {
    if (persistent)
      console.log("Storage will not be cleared except by explicit user action");
    else
      console.log("Storage may be cleared by the UA under storage pressure.");
  });
}
```

Once granted, anything you store will not be deleted automatically by the device. It can only be deleted by user action.
