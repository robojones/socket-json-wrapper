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

`server.js`
```javascript
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

`client.js`
```javascript
const socket = net.createConnection(8080)

const connection = new Connection(socket)

connection.on('message', data => {
  console.log('received:', data)
  // will log { dataFromServer: 'foo' }
})

// send some data to the server.
connection.send({ dataFromClient: 'baz' })
```
