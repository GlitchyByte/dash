// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { GMath } from "./GMath"
import { GByteBufferReader } from "./GByteBufferReader"

/**
 * Bit buffer reader.
 */
export class GBitBufferReader {

  private readonly _bufferReader: GByteBufferReader
  private _currentByte = 0
  private _usedBits: number | null = null

  /**
   * Creates a reader from the given data.
   *
   * @param bytes Data to read from.
   */
  constructor(bytes: ArrayBuffer) {
    this._bufferReader = new GByteBufferReader(bytes)
  }

  /**
   * Size of buffer, in bytes.
   */
  public get size(): number {
    return this._bufferReader.size
  }

  /**
   * Bit reader head position.
   */
  public get position(): number {
    return this._usedBits === null ? 0 : (this._bufferReader.cursor * 8) - 8 + this._usedBits
  }

  /**
   * Returns true if we have read all bits.
   */
  public isAtEnd(): boolean {
    return this._bufferReader.isAtEnd() && ((this._usedBits ?? 0) >= 8)
  }

  private _readBits(bitCount: number): [number, number] {
    if ((this._usedBits === null) || (this._usedBits >= 8)) {
      this._currentByte = this._bufferReader.readUInt8()
      this._usedBits = 0
    }
    const availableBits = 8 - this._usedBits
    const bitsToRead = GMath.min(bitCount, availableBits)
    const bitMask = (1 << bitsToRead) - 1
    const value = (this._currentByte >>> (availableBits - bitsToRead)) & bitMask
    this._usedBits += bitsToRead
    return [bitsToRead, value]
  }

  /**
   * Read the given number of bits.
   *
   * @param bitCount Count of bits to read.
   */
  public read(bitCount: number): number {
    let result = 0
    let totalBitsRead = 0
    while (totalBitsRead < bitCount) {
      const [bitsRead, value] = this._readBits(bitCount - totalBitsRead)
      totalBitsRead += bitsRead
      const offset = bitCount - totalBitsRead
      const bitsInPosition = value << offset
      result |= bitsInPosition
    }
    return result >>> 0
  }

  /**
   * Returns a string representation of the contents.
   *
   * Could be huge! Mainly for debugging.
   */
  public toString(): string {
    return this._bufferReader.toString()
  }
}
