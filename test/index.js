const assert = require('assert')
const net = require('net')
const once = require('once-promise').default

describe('socket-json-wrapper', function () {
  const { Connection } = require('..')

  beforeEach(async function () {
    this._server = net.createServer(socket => {
      this.server = new Connection(socket)
    }).listen('test-socket')

    await once(this._server, 'listening')

    this._client = net.createConnection('test-socket')
    this.client = new Connection(this._client)

    // wait for connection
    const queue = [once(this._server, 'connection'), once(this._client, 'connect')]
    await Promise.all(queue)
  })

  afterEach(async function () {
    if (!this.client.isDead) {
      this._client.end()
    }

    this._server.close()

    await once(this._server, 'close')
  })

  it('should transfer objects', async function () {
    const exampleObject = { hello: 'world' }
    this.client.send(exampleObject)

    const result = await once(this.server, 'message')

    assert.deepEqual(result, exampleObject)
  })

  it('should emit an error if invalid json is transfered', function (cb) {
    const msg = 'asdf\n'
    this.server.once('error', err => {
      assert.strictEqual(err.text, msg.trim())
      cb()
    })
    this.client.socket.write(msg)
  })

  describe('.send()', function () {
    it('should return false if the connection is closed', function () {
      this.client.close()

      assert(!this.client.send({}))
    })
  })

  describe('.close()', function () {
    it('should return true when called for the first time.', function () {
      assert(this.client.close())
      assert(!this.client.close())
    })
  })
})
