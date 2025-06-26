// Copyright 2024-2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from "vitest"
import { bytesToString, numberToBinaryString, numberToHexString, separatedString, stringToBytes } from "../src"

describe("gutils", () => {
  it("stringToBytes", () => {
    const str = "salmon"
    const bytes = stringToBytes(str)
    expect(bytes.length).toBe(6)
    expect(bytes[1]).toBe(0x61)
    expect(bytes[5]).toBe(0x6e)
  })

  it("bytesToString", () => {
    const bytes = Uint8Array.from([0x63, 0x61, 0x55, 0x54, 0x64, 0x6e])
    const str = bytesToString(bytes)
    expect(str.length).toBe(6)
    expect(str[1]).toBe("a")
    expect(str[5]).toBe("n")
  })

  describe("numberToHexString", () => {
    it("uppercase", () => {
      const value = 0x1467cafe
      const str = numberToHexString(value, 1, true)
      expect(str).toBe("1467CAFE")
    })

    it("lowercase", () => {
      const value = 0x1467cafe
      const str = numberToHexString(value, 1, false)
      expect(str).toBe("1467cafe")
    })

    it("padding", () => {
      const value = 0xcafe
      const str = numberToHexString(value, 8)
      expect(str).toBe("0000cafe")
    })
  })

  it("numberToBinaryString", () => {
    const value = 0x8001
    const str = numberToBinaryString(value)
    expect(str).toBe("1000000000000001")
  })

  describe("separatedString", () => {
    it("right to left", () => {
      const value = 0x467cafe
      const str = separatedString(numberToHexString(value), 2, " ", true)
      expect(str).toBe("4 67 ca fe")
    })

    it("left to right", () => {
      const value = 0x467cafe
      const str = separatedString(numberToHexString(value), 2, " ", false)
      expect(str).toBe("46 7c af e")
    })
  })
})
