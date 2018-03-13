# socket-json-wrapper

Wrapper for socket connections that allows you to send and receive json objects.

[![Build Status](https://circleci.com/gh/robojones/socket-json-wrapper.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/robojones/socket-json-wrapper/tree/master)
[![Test Coverage](https://codeclimate.com/github/robojones/socket-json-wrapper/badges/coverage.svg)](https://codeclimate.com/github/robojones/socket-json-wrapper/coverage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![bitHound Code](https://www.bithound.io/github/robojones/socket-json-wrapper/badges/code.svg)](https://www.bithound.io/github/robojones/socket-json-wrapper)
[![bitHound Overall Score](https://www.bithound.io/github/robojones/socket-json-wrapper/badges/score.svg)](https://www.bithound.io/github/robojones/socket-json-wrapper)
[![bitHound Dependencies](https://www.bithound.io/github/robojones/socket-json-wrapper/badges/dependencies.svg)](https://www.bithound.io/github/robojones/socket-json-wrapper/master/dependencies/npm)

## Installation

```
npm i socket-json-wrapper
```

## Usage

In the `server.js` file:
```javascript
const net = require('net')
const { Connection } = require('socket-json-wrapper')

const server = net.createServer(socket => {
  const connection = new Connection(socket)

  connection.on('message', data => {
    console.log('received:', data)
    // will log { dataFromClient: 'baz' }
  })

  // send some data to the server.
  connection.send({ dataFromServer: 'foo' })
})
```

In the `client.js` file:

```javascript
const net = require('net')
const { Connection } = require('socket-json-wrapper')

const socket = net.createConnection(8080)

const connection = new Connection(socket)

connection.on('message', data => {
  console.log('received:', data)
  // will log { dataFromServer: 'foo' }
})

// send some data to the server.
connection.send({ dataFromClient: 'baz' })
```

## API

### connection.isDead

`<boolean>`

Is set to true if the underlying socket is not writable.

### connection.socket

A refference to the wrapped socket.

### connection.send(data)

- __data__ `<*>` - This may be any value that can by stringified to valid JSON.

It __returns__ a `<boolean>` that is true if the data was written to the socket.

### connection.close()

This method calls `.end()` on the underlying socket.

## Typescript usage

In typescript you can define types that can be sent or received.
You can do so by creating an interface and by passing it to the Connection when you are creating it.

```typescript
import { createConnection } from 'net'
import { Connection } from 'socket-json-wrapper'

const socket = createConnection(8080)

interface Sendable {
  dataFromClient: string
}

interface Receivable {
  dataFromServer: string
}

// Pass interfaces that represent the messages that can be sent or received so you can get completions.
const connection = new Connection<Sendable, Receivable>(socket)

connection.on('message', data => {
  // Typescript will automatically know that the data parameter has a dataFromServer property.
  console.log('received:', data)
  // will log { dataFromServer: 'foo' }
})

// send some data to the server.
connection.send({ dataFromClient: 'baz' })
// Typescript will automatically detect if your message does not match the sendable type defined in the interface above.
```
