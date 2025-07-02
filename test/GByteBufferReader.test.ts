// Copyright 2024-2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from "vitest"
import { GByteBufferReader, GByteBufferWriter } from "../src"

describe("GByteBufferReader", () => {
  it("create", () => {
    const size = 8
    const bytes = new Uint8Array(size)
    const buffer = new GByteBufferReader(bytes.buffer)
    expect(buffer.size).toBe(size)
  })

  it("readUInt8", () => {
    const writer = new GByteBufferWriter()
    writer.writeUInt32(0x01020304)
    writer.writeUInt8(0x05)
    const extractedBytes = writer.extractBytes()
    const reader = new GByteBufferReader(extractedBytes.buffer)
    const value = reader.readUInt8()
    expect(value).toBe(0x04)
  })

  it("readUInt16", () => {
    const writer = new GByteBufferWriter()
    writer.writeUInt32(0x01020304)
    writer.writeUInt8(0x05)
    const extractedBytes = writer.extractBytes()
    const reader = new GByteBufferReader(extractedBytes.buffer)
    const value = reader.readUInt16()
    expect(value).toBe(0x0304)
  })

  it("readUInt32", () => {
    const writer = new GByteBufferWriter()
    writer.writeUInt32(0x01020304)
    writer.writeUInt8(0x05)
    const extractedBytes = writer.extractBytes()
    const reader = new GByteBufferReader(extractedBytes.buffer)
    reader.readUInt8() // Skip a byte.
    const value = reader.readUInt32()
    expect(value).toBe(0x05010203)
  })

  it("readFloat16", () => {
    const writer = new GByteBufferWriter()
    writer.writeUInt8(0x05)
    writer.writeFloat16(1.5)
    const extractedBytes = writer.extractBytes()
    const reader = new GByteBufferReader(extractedBytes.buffer)
    reader.readUInt8() // Skip a byte.
    const value = reader.readFloat16()
    expect(value).toBe(1.5)
  })

  it("readFloat32", () => {
    const writer = new GByteBufferWriter()
    writer.writeUInt8(0x05)
    writer.writeFloat32(1.5)
    const extractedBytes = writer.extractBytes()
    const reader = new GByteBufferReader(extractedBytes.buffer)
    reader.readUInt8() // Skip a byte.
    const value = reader.readFloat32()
    expect(value).toBe(1.5)
  })

  it("readBytes", () => {
    const writer = new GByteBufferWriter()
    writer.writeUInt32(0x01020304)
    const bytes = new Uint8Array([0x05, 0x06, 0x07, 0x08])
    writer.writeBytes(bytes)
    const extractedBytes = writer.extractBytes()
    const reader = new GByteBufferReader(extractedBytes.buffer)
    reader.readUInt8() // Skip a byte.
    const readBytes = reader.readBytes(5)
    expect(readBytes[0]).toBe(0x03)
    expect(readBytes[1]).toBe(0x02)
    expect(readBytes[2]).toBe(0x01)
    expect(readBytes[3]).toBe(0x05)
    expect(readBytes[4]).toBe(0x06)
    const value = reader.readUInt8()
    expect(value).toBe(0x07)
  })

  it("cursor to end", () => {
    const writer = new GByteBufferWriter()
    writer.writeUInt8(0x05)
    writer.writeFloat32(1.5)
    const extractedBytes = writer.extractBytes()
    const reader = new GByteBufferReader(extractedBytes.buffer)
    expect(reader.cursor).toBe(0)
    expect(reader.isAtEnd()).toBeFalsy()
    reader.readUInt8()
    expect(reader.cursor).toBe(1)
    expect(reader.isAtEnd()).toBeFalsy()
    reader.readFloat32()
    expect(reader.cursor).toBe(5)
    expect(reader.isAtEnd()).toBeTruthy()
  })
})
