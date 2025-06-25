// Copyright 2024-2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { numberToHexString } from "./gutils"
import { GMath } from "./GMath"

/**
 * Dynamic byte buffer writer.
 *
 * Buffer increases its capacity as needed.
 * All storage is little-endian.
 */
export class GByteBufferWriter {

  private _size: number
  private _bytes: ArrayBuffer
  private _view: DataView
  private readonly _expansionRate: number

  /**
   * Create a writer ready to receive data.
   *
   * @param bytes Initial contents, or null to create an empty buffer.
   * @param expansionRate Rate at which this buffer will grow when more space is needed.
   */
  constructor(bytes: ArrayBuffer | null = null, expansionRate: number = 1.5) {
    if (expansionRate <= 1) {
      throw new Error(`Expansion rate (${expansionRate}) must be greater than 1!`)
    }
    this._expansionRate = expansionRate
    if (bytes) {
      this._size = bytes.byteLength
      const newCapacity = Math.ceil(bytes.byteLength * this._expansionRate)
      this._bytes = bytes.transferToFixedLength(newCapacity)
    } else {
      this._size = 0
      this._bytes = new ArrayBuffer(64)
    }
    this._view = new DataView(this._bytes)
  }

  /**
   * The current capacity before it needs to expand.
   */
  public get capacity(): number {
    return this._bytes.byteLength
  }

  private _ensureCapacity(capacity: number): void {
    if (capacity <= this.capacity) {
      return
    }
    const newCapacity = GMath.max(capacity, Math.ceil(this.capacity * this._expansionRate))
    this._bytes = this._bytes.transferToFixedLength(newCapacity)
    this._view = new DataView(this._bytes)
  }

  private _ensureAddedCapacity(additionalCapacity: number): void {
    this._ensureCapacity(this._size + additionalCapacity)
  }

  /**
   * The size of used bytes within the buffer.
   */
  public get size(): number {
    return this._size
  }

  /**
   * Extracts the used bytes.
   */
  public extractBytes(): Uint8Array<ArrayBuffer> {
    this._bytes = this._bytes.transferToFixedLength(this._size)
    this._view = new DataView(this._bytes)
    return new Uint8Array(this._bytes)
  }

  /**
   * Writes a UInt8 to the buffer.
   *
   * @param value UInt8 value.
   */
  public writeUInt8(value: number): void {
    this._ensureAddedCapacity(1)
    this._view.setUint8(this._size, value)
    this._size += 1
  }

  /**
   * Writes a UInt16 to the buffer.
   *
   * @param value UInt16 value.
   */
  public writeUInt16(value: number): void {
    this._ensureAddedCapacity(2)
    this._view.setUint16(this._size, value, true)
    this._size += 2
  }

  /**
   * Writes a UInt32 to the buffer.
   *
   * @param value UInt32 value.
   */
  public writeUInt32(value: number): void {
    this._ensureAddedCapacity(4)
    this._view.setUint32(this._size, value, true)
    this._size += 4
  }

  /**
   * Writes a Float8 to the buffer.
   *
   * @param value Float8 value.
   */
  public writeFloat16(value: number): void {
    this._ensureAddedCapacity(2)
    this._view.setFloat16(this._size, value, true)
    this._size += 2
  }

  /**
   * Writes a Float16 to the buffer.
   *
   * @param value Float16 value.
   */
  public writeFloat32(value: number): void {
    this._ensureAddedCapacity(4)
    this._view.setFloat32(this._size, value, true)
    this._size += 4
  }
}

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
    return value
  }

  /**
   * Reads a UInt16 from the buffer and advances the cursor.
   */
  public readUInt16(): number {
    const value = this._view.getUint16(this._cursor, true)
    this._cursor += 2
    return value
  }

  /**
   * Reads a UInt32 from the buffer and advances the cursor.
   */
  public readUInt32(): number {
    const value = this._view.getUint32(this._cursor, true)
    this._cursor += 4
    return value
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
