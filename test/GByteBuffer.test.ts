// Copyright 2024-2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { GByteBufferWriter, GByteBufferReader } from "../src"

describe("GByteBuffer", () => {
  describe("GByteBufferWriter", () => {
    it("create with existing buffer", () => {
      const size = 8
      const bytes = new Uint8Array(size)
      const buffer = new GByteBufferWriter(bytes.buffer)
      expect(buffer.size).toBe(size)
      expect(buffer.capacity).toBeGreaterThanOrEqual(size)
    })

    it("prevent illegal expansion rate", () => {
      expect(() => {
        new GByteBufferWriter(null, 0)
      }).toThrow()
      expect(() => {
        new GByteBufferWriter(null, -2.3)
      }).toThrow()
    })

    it("buffer capacity doesn't expand unnecessarily", () => {
      const size = 8
      const bytes = new Uint8Array(size)
      const buffer = new GByteBufferWriter(bytes.buffer)
      const capacity = buffer.capacity
      expect(buffer.size).toBe(size)
      expect(capacity).toBeGreaterThan(size)
      buffer.writeUInt8(0xff)
      expect(buffer.size).toBe(size + 1)
      expect(buffer.capacity).toBe(capacity)
    })

    it("ensure buffer capacity expansion", () => {
      const size = 8
      const bytes = new Uint8Array(size)
      const buffer = new GByteBufferWriter(bytes.buffer, 1.5)
      const capacity = buffer.capacity
      expect(buffer.size).toBe(size)
      expect(capacity).toBeGreaterThan(size)
      buffer.writeUInt32(0x01020304)
      expect(buffer.size).toBe(size + 4)
      expect(buffer.capacity).toBe(capacity)
      buffer.writeUInt8(0xff)
      expect(buffer.size).toBe(size + 5)
      expect(buffer.capacity).toBeGreaterThan(capacity)
    })

    it("writeUInt8", () => {
      const size = 5
      const bytes = new Uint8Array(size)
      const buffer = new GByteBufferWriter(bytes.buffer)
      buffer.writeUInt8(0x01)
      expect(buffer.size).toBe(size + 1)
    })

    it("writeUInt16", () => {
      const size = 5
      const bytes = new Uint8Array(size)
      const buffer = new GByteBufferWriter(bytes.buffer)
      buffer.writeUInt16(0x0102)
      expect(buffer.size).toBe(size + 2)
    })

    it("writeUInt32", () => {
      const size = 5
      const bytes = new Uint8Array(size)
      const buffer = new GByteBufferWriter(bytes.buffer)
      buffer.writeUInt32(0x01020304)
      expect(buffer.size).toBe(size + 4)
    })

    it("writeFloat16", () => {
      const size = 5
      const bytes = new Uint8Array(size)
      const buffer = new GByteBufferWriter(bytes.buffer)
      buffer.writeFloat16(1.234)
      expect(buffer.size).toBe(size + 2)
    })

    it("writeFloat32", () => {
      const size = 5
      const bytes = new Uint8Array(size)
      const buffer = new GByteBufferWriter(bytes.buffer)
      buffer.writeFloat32(1.234)
      expect(buffer.size).toBe(size + 4)
    })

    it("extractBytes", () => {
      const bytes = new Uint8Array(5)
      const buffer = new GByteBufferWriter(bytes.buffer)
      buffer.writeUInt32(0x01020304)
      const extractedBytes = buffer.extractBytes()
      expect(extractedBytes.length).toBe(9)
    })
  })

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
})
