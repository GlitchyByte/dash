// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { GMath } from "./GMath"
import { GByteBufferWriter, GByteBufferReader } from "./GByteBuffer"

/**
 * Dynamic bit buffer writer.
 *
 * Buffer increases its capacity as needed.
 */
export class GBitBufferWriter {

  private readonly _bufferWriter: GByteBufferWriter
  private _currentByte = 0
  private _currentBits = 0

  /**
   * Creates a writer ready to receive data.
   *
   * @param bytes Initial contents, or null to create an empty buffer.
   * @param expansionRate Rate at which this buffer will grow when more space is needed.
   */
  constructor(bytes: ArrayBuffer | null = null, expansionRate: number = 1.5) {
    this._bufferWriter = new GByteBufferWriter(bytes, expansionRate)
  }

  /**
   * Size of buffer, in bytes.
   */
  public get size(): number {
    return this._bufferWriter.size + (this._currentBits === 0 ? 0 : 1)
  }

  private _flushByte(): void {
    this._bufferWriter.writeUInt8(this._currentByte)
    this._currentByte = 0
    this._currentBits = 0
  }

  /**
   * Write a given number of bits.
   *
   * @param bitCount Count of bits to write.
   * @param data Value of those bits.
   */
  public write(bitCount: number, data: number): void {
    let bitsWritten = 0
    let bitsLeft = bitCount
    while (bitsLeft > 0) {
      let availableBitsInBuffer = 8 - this._currentBits
      if (availableBitsInBuffer === 0) {
        this._flushByte()
        availableBitsInBuffer = 8
      }
      const bitsToWrite = GMath.min(bitsLeft, availableBitsInBuffer)
      const bitMask = (1 << bitsToWrite) - 1
      const bits = (data >>> (bitCount - bitsWritten - bitsToWrite)) & bitMask
      const bitsInPosition = bits << (availableBitsInBuffer - bitsToWrite)
      this._currentByte |= bitsInPosition
      this._currentBits += bitsToWrite
      bitsWritten += bitsToWrite
      bitsLeft -= bitsToWrite
    }
    if (this._currentBits >= 8) {
      this._flushByte()
    }
  }

  /**
   * Extracts the used bytes.
   *
   * Note that if we had a partial byte, it will be written to the buffer.
   * Any further writes will start at a new byte.
   */
  public extractBytes(): Uint8Array<ArrayBuffer> {
    if (this._currentBits > 0) {
      this._flushByte()
    }
    return this._bufferWriter.extractBytes()
  }
}

/**
 * Bit buffer reader.
 */
export class GBitBufferReader {

  private readonly _bufferReader: GByteBufferReader
  private _currentByte = 0
  private _usedBits = 8

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
   * Returns true if we have read all bits.
   */
  public isAtEnd(): boolean {
    return this._bufferReader.isAtEnd() && (this._usedBits >= 8)
  }

  private _readBits(bitCount: number): [number, number] {
    if (this._usedBits >= 8) {
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
    return result
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
