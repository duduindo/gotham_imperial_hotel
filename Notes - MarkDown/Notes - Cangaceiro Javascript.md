

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
connection instanceof IDBDatabase // TRUE
```

```js
const openRequest = window.indexedDB.open('jscangaceiro', 1);

openRequest.onupgradeneeded  = e => {
  const connection = e.target.result; // IDBDatabase
  
  if (connection.objectStoreNames.contains('negociacoes')) {
    connection.deleteObjectStore('negociacoes');
  }

  connection.createObjectStore('negociacoes', { autoIncrement: true }); // "Tabela SQL"
};
```


### Transações e persistência 

```js
import Negociacao from './cangaceiro/../negociacao/Negociacao.js';

const openRequest = window.indexedDB.open('jscangaceiro', 2);

// Adiciona negociações
function add(conn = IDBDatabase.prototype) {
  const negociacao = new Negociacao(new Date(), 200, 1);

  conn
    .transaction(['negociacoes'], 'readwrite')
    .objectStore('negociacoes')
    .add(negociacao);
}

// On upgrade needed
openRequest.onupgradeneeded  = e => {
  const connection = e.target.result;

  if (connection.objectStoreNames.contains('negociacoes')) {
    connection.deleteObjectStore('negociacoes');
  }

  connection.createObjectStore('negociacoes', { autoIncrement: true });
};

// On success
openRequest.onsuccess = e => {
  const connection = e.target.result;

  add(connection);
};
```

#### No Chrome
<img src="images/Captura de tela de 2018-10-09 18-51-03.png" title="Print no Chrome > Application > IndexedDB">


### 14.6 Cursores

