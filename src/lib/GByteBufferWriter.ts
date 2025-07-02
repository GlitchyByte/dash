// Copyright 2024-2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

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
   * Creates a writer ready to receive data.
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

  /**
   * Writes a byte array to the buffer.
   *
   * @param bytes Byte array.
   */
  public writeBytes(bytes: Uint8Array): void {
    const byteCount = bytes.byteLength
    this._ensureAddedCapacity(byteCount)
    const buffer = new Uint8Array(this._bytes, this._size, byteCount)
    buffer.set(bytes)
    this._size += byteCount
  }
}
