// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from "vitest"
import { GBitBufferReader, GBitBufferWriter } from "../src"

describe("GBitBufferReader", () => {
  it("create", () => {
    const size = 8
    const bytes = new Uint8Array(size)
    const buffer = new GBitBufferReader(bytes.buffer)
    expect(buffer.size).toBe(size)
  })

  it("read", () => {
    const writer = new GBitBufferWriter()
    writer.write(32, 0x01020304)
    writer.write(8, 0x05)
    const extractedBytes = writer.extractBytes()
    const reader = new GBitBufferReader(extractedBytes.buffer)
    let value = reader.read(8)
    expect(value).toBe(0x01)
    value = reader.read(8)
    expect(value).toBe(0x02)
    value = reader.read(7)
    expect(value).toBe(0x01)
    value = reader.read(9)
    expect(value).toBe(0x104)
  })

  it("isAtEnd", () => {
    const writer = new GBitBufferWriter()
    writer.write(8, 0x05)
    writer.write(32, 0x01020304)
    const extractedBytes = writer.extractBytes()
    const reader = new GBitBufferReader(extractedBytes.buffer)
    reader.read(30)
    expect(reader.isAtEnd()).toBeFalsy()
    reader.read(8)
    expect(reader.isAtEnd()).toBeFalsy()
    reader.read(2)
    expect(reader.isAtEnd()).toBeTruthy()
  })
})
