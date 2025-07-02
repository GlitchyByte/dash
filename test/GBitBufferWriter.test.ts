// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from "vitest"
import { GBitBufferWriter } from "../src"

describe("GBitBufferWriter", () => {
  it("create with existing buffer", () => {
    const size = 8
    const bytes = new Uint8Array(size)
    const buffer = new GBitBufferWriter(bytes.buffer)
    expect(buffer.size).toBe(size)
  })

  it("write < 8 bits", () => {
    const size = 5
    const bytes = new Uint8Array(size)
    const buffer = new GBitBufferWriter(bytes.buffer)
    buffer.write(2, 0x01)
    expect(buffer.size).toBe(size + 1)
  })

  it("write 8 bits", () => {
    const size = 5
    const bytes = new Uint8Array(size)
    const buffer = new GBitBufferWriter(bytes.buffer)
    buffer.write(8, 0x81)
    expect(buffer.size).toBe(size + 1)
  })

  it("write > 8 bits", () => {
    const size = 5
    const bytes = new Uint8Array(size)
    const buffer = new GBitBufferWriter(bytes.buffer)
    buffer.write(12, 0x0401)
    expect(buffer.size).toBe(size + 2)
  })

  it("extractBytes exact", () => {
    const bytes = new Uint8Array(5)
    const buffer = new GBitBufferWriter(bytes.buffer)
    buffer.write(32, 0x01020304)
    const extractedBytes = buffer.extractBytes()
    expect(extractedBytes.length).toBe(9)
  })

  it("extractBytes with lingering bits", () => {
    const bytes = new Uint8Array(5)
    const buffer = new GBitBufferWriter(bytes.buffer)
    buffer.write(28, 0x01020304)
    const extractedBytes = buffer.extractBytes()
    expect(extractedBytes.length).toBe(9)
  })
})
