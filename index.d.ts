/// <reference types="node" />
import { EventEmitter } from 'events'
import { StringDecoder } from 'string_decoder'
import * as net from 'net'

interface Connection {
  on(event: 'message', listener: (data: any) => void): this;
  emit(event: 'message', data: any): boolean;
}

/**
 * Class representing a connection to the daemon.
 */
export declare class Connection extends EventEmitter {
  /**
   * Create a new connection to the daemon.
   */
  constructor(socket: net.Socket);

  /**
   * Is true if the underlying socket is not writable.
   */
  readonly isDead: boolean;

  /**
   * Parses this._message and emits the "message" event if one was received.
   */
  _parse(): void;

  /**
   * Writes a message to the socket. Returns true if the message was written to the socket.
   * @param data - The object to transmit.
   */
  send(data: any): boolean;

  /**
   * Close the connection.
   */
  close(): void

  static Connection: typeof Connection
}
