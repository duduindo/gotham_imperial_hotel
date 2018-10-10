

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
const openRequest = window.indexedDB.open('jscangaceiro', 2);

// On Upgrade Needed
openRequest.onupgradeneeded  = e => {
  const connection = e.target.result;

  if (connection.objectStoreNames.contains('negociacoes')) {
    connection.deleteObjectStore('negociacoes');
  }

  connection.createObjectStore('negociacoes', { autoIncrement: true });
};

// On Success
openRequest.onsuccess = e => {
  const connection = e.target.result;
  const data = { data: new Date(), quantidade: 200, valor: 1 };

  connection
    .transaction(['negociacoes'], 'readwrite')
    .objectStore('negociacoes')
    .add(data);
};
```

#### No Chrome
<img src="images/Captura de tela de 2018-10-09 18-51-03.png" title="Print no Chrome > Application > IndexedDB">


### 14.6 Cursores

```js
const openRequest = window.indexedDB.open('jscangaceiro', 2);

openRequest.onsuccess = e => {
  const connection = e.target.result;
  const cursors = [];
  const data = { data: new Date(), quantidade: 200, valor: 1 };
  const cursor = connection
    .transaction(['negociacoes'], 'readonly')
    .objectStore('negociacoes')
    .openCursor();


  cursor.onsuccess = e => {
    // Objeto ponteiro para uma negociação
    const atual = e.target.result;

    // Se for diferente de null, é porque ainda há dado:
    if (atual) {
      cursors.push(atual.value);

      // Vai para a próxima posição chamando onsuccess novamente
      atual.continue();
    } else {
      // quando atual for null, é porqiue não há mais
      // imprimimos no console a lista de negociações
      console.log(cursors);
    }
  };
};
```

**Resultado:**
```json
[
  {
    "data": "2018-10-10T11:41:16.884Z", 
    "quantidade": 200,
    "valor": 1
  },
  {
    "data": "2018-10-10T11:51:04.152Z",
    "quantidade": 200, 
    "valor":1
  } 
]
```

### 15.1 A classe ConnectionFactory

Este método nos devolverá uma `Promise` pelo fato de a abertura de uma conexão com o banco ser realizada de maneira assíncrona.

```js
const stores = ['negociacoes'];

class ConnectionFactory {
  constructor() {
    throw new Error('Não é possível criar instâncias dessa classe');
  }

  static _createStores(connection) {
    // Itera no array para construir as Stores
    stores.forEach(store => {
      if (connection.objectStoreNames.contains(store)) {
        connection.deleteObjectStore(store);
      }

      connection.createObjectStore(store, { autoIncrement: true });
    });
  }

  static getConnection() {
    return new Promise((resolve, reject) => {
      const openRequest = window.indexedDB.open('jscangaceiro', 2);

      openRequest.onupgradeneeded = e => {
        // Passa a conexão para o método
        ConnectionFactory._createStores(e.target.result);
      };

      openRequest.onsuccess = e => {
        // passa o resultado (conexão) para a promise!
        resolve(e.target.result)
      };

      openRequest.onerror = e => {
        console.log(e.target.error);

        // passa o erro para reject de promise!
        reject(e.target.error.name);
      };
    });
  }
}

// Usando:
ConnectionFactory.getConnection().then(connection => console.log(connection));

```
