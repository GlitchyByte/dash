// Copyright 2024-2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { numberToHexString } from "./gutils"

/**
 * Byte buffer reader.
 *
 * All storage is treated as little-endian.
 */
export class GByteBufferReader {

  private readonly _bytes: ArrayBuffer
  private readonly _view: DataView
  private _cursor = 0

  /**
   * Creates a reader from the given data. All bytes are considered used.
   *
   * @param bytes Data to read from.
   */
  constructor(bytes: ArrayBuffer) {
    this._bytes = bytes
    this._view = new DataView(this._bytes)
  }

  /**
   * Size of buffer.
   */
  public get size(): number {
    return this._bytes.byteLength
  }

  /**
   * Current reading position.
   */
  public get cursor(): number {
    return this._cursor
  }

  /**
   * Returns true if we have read all data.
   */
  public isAtEnd(): boolean {
    return this._cursor >= this.size
  }

  /**
   * Reads a UInt8 from the buffer and advances the cursor.
   */
  public readUInt8(): number {
    const value = this._view.getUint8(this._cursor)
    this._cursor += 1
    return value >>> 0
  }

  /**
   * Reads a UInt16 from the buffer and advances the cursor.
   */
  public readUInt16(): number {
    const value = this._view.getUint16(this._cursor, true)
    this._cursor += 2
    return value >>> 0
  }

  /**
   * Reads a UInt32 from the buffer and advances the cursor.
   */
  public readUInt32(): number {
    const value = this._view.getUint32(this._cursor, true)
    this._cursor += 4
    return value >>> 0
  }

  /**
   * Reads a Float8 from the buffer and advances the cursor.
   */
  public readFloat16(): number {
    const value = this._view.getFloat16(this._cursor, true)
    this._cursor += 2
    return value
  }

  /**
   * Reads a Float16 from the buffer and advances the cursor.
   */
  public readFloat32(): number {
    const value = this._view.getFloat32(this._cursor, true)
    this._cursor += 4
    return value
  }

  /**
   * Reads count bytes from the buffer and advances the cursor.
   *
   * @param count Count of bytes to read.
   */
  public readBytes(count: number): Uint8Array {
    const value = new Uint8Array(this._bytes, this._cursor, count)
    this._cursor += count
    return value
  }

  /**
   * Returns a string representation of the contents.
   *
   * Could be huge! Mainly for debugging.
   */
  public toString() {
    const view = this._view
    const size = this.size
    let bytes = ""
    for (let i = 0; i < size; ++i) {
      if (bytes.length !== 0) {
        bytes += " "
      }
      bytes += numberToHexString(view.getUint8(i), 2)
    }
    return `[${bytes}]`
  }
}
