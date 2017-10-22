const { BetterEvents } = require('better-events')
const { StringDecoder } = require('string_decoder')

/**
 * Class representing a connection to the daemon.
 * @class
 */
class Connection extends BetterEvents {
  /**
   * Create a new connection to the daemon.
   * @param {*} socket 
   */
  constructor(socket) {
    super()

    this.socket = socket
    this._message = ''

    const decoder = new StringDecoder()

    socket.on('data', async chunk => {
      this._message += decoder.write(chunk)

      this._parse()
    })

    socket.once('end', async () => {
      this._message += decoder.end()
      this._parse()
    })
  }

  /**
   * Is true if the underlying socket is not writable.
   * @returns {boolean}
   */
  get isDead() {
    return !this.socket.writable
  }

  /**
   * Parses this._message and emits the "message" event if one was received.
   * @returns {void}
   */
  _parse() {
    while (true) {
      const i = this._message.indexOf('\n')
      if (i === -1) {
        break
      }

      const msg = this._message.substr(0, i)
      this._message = this._message.substr(i + 1)

      try {
        const obj = JSON.parse(msg)
        this.emit('message', obj)
      } catch (error) {
        error.text = msg
        this.emit('error', error)
      }
    }
  }

  /**
   * Writes a message to the socket. Returns true if the message was written to the socket.
   * @param {*} data - The object to transmit.
   * @returns {boolean}
   */
  send(data) {
    if (this.isDead) {
      return false
    }

    this.socket.write(JSON.stringify(data) + '\n')
    return true
  }

  /**
   * Close the connection.
   * @returns {void}
   */
  close() {
    if (this.isDead) {
      return false
    }

    this.socket.end()
    return true
  }
}

Connection.Connection = Connection

module.exports = Connection
