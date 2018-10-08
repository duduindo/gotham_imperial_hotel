

## IndexedDB 

### Eventos

```js
const openRequest = window.indexedDB.open('jscangaceiro', 1);
```

`open()` é uma instância de `IDBOpenDBRequest`

```js
openRequest instanceof IDBOpenDBRequest // TRUE
```

* onupgradeneeded
* onsuccess
* onerror



### Object Store 

**Importante:** Entenda uma store como  algo  análogo às  tabelas do  mundo SQL.

Pode ser que o evento esteja sendo disparado durante uma atualização,
nesse caso, verificamos se a store existe, se existir
apagamos a store atual antes de criarmos uma nova

```js
const openRequest = window.indexedDB.open('jscangaceiro', 1);

openRequest.onupgradeneeded  = e => {
  const connection = e.target.result;
  
  if (connection.objectStoreNames.contains('negociacoes')) {
    connection.deleteObjectStore('negociacoes');
  }

  connection.createObjectStore('negociacoes', { autoIncrement: true }); // "Tabela SQL"
};
```
