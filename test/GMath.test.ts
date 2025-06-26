// Copyright 2024-2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from "vitest"
import { GMath } from "../src"

describe("GMath", () => {
  describe("min", () => {
    it("v1 < v2", () => {
      const v1 = 77
      const v2 = 888
      const result = GMath.min(v1, v2)
      expect(result).toBe(77)
    })

    it("v1 > v2", () => {
      const v1 = 888
      const v2 = 77
      const result = GMath.min(v1, v2)
      expect(result).toBe(77)
    })

    it("v1 == v2", () => {
      const v1 = 77
      const v2 = 77
      const result = GMath.min(v1, v2)
      expect(result).toBe(77)
    })
  })

  describe("max", () => {
    it("v1 < v2", () => {
      const v1 = 77
      const v2 = 888
      const result = GMath.max(v1, v2)
      expect(result).toBe(888)
    })

    it("v1 > v2", () => {
      const v1 = 888
      const v2 = 77
      const result = GMath.max(v1, v2)
      expect(result).toBe(888)
    })

    it("v1 == v2", () => {
      const v1 = 77
      const v2 = 77
      const result = GMath.max(v1, v2)
      expect(result).toBe(77)
    })
  })

  describe("rollingAverage", () => {
    it("0 -> 6 -> 3", () => {
      let result = GMath.rollingAverage(1, 0, 6)
      expect(result).toBe(6)
      result = GMath.rollingAverage(2, result, 3)
      expect(result).toBe(4.5)
    })

    it("0 -> -6 -> 3", () => {
      let result = GMath.rollingAverage(1, 0, -6)
      expect(result).toBe(-6)
      result = GMath.rollingAverage(2, result, 3)
      expect(result).toBe(-1.5)
    })
  })

  describe("clamp", () => {
    it("[1, 9] -> 1", () => {
      const low = 1
      const high = 9
      const result = GMath.clamp(1, low, high)
      expect(result).toBe(1)
    })

    it("[1, 9] -> -5", () => {
      const low = 1
      const high = 9
      const result = GMath.clamp(-5, low, high)
      expect(result).toBe(1)
    })

    it("[1, 9] -> 50", () => {
      const low = 1
      const high = 9
      const result = GMath.clamp(50, low, high)
      expect(result).toBe(9)
    })
  })

  describe("lerp", () => {
    it("[1, 9] -> low", () => {
      const low = 1
      const high = 9
      const result = GMath.lerp(0, low, high)
      expect(result).toBe(low)
    })

    it("[1, 9] -> high", () => {
      const low = 1
      const high = 9
      const result = GMath.lerp(1, low, high)
      expect(result).toBe(high)
    })

    it("[1, 9] -> one quarter of the way", () => {
      const low = 1
      const high = 9
      const result = GMath.lerp(0.25, low, high)
      expect(result).toBe(3)
    })

    it("[1, 9] -> below 0", () => {
      const low = 1
      const high = 9
      const result = GMath.lerp(-2, low, high)
      expect(result).toBe(-15)
    })

    it("[1, 9] -> beyond 1", () => {
      const low = 1
      const high = 9
      const result = GMath.lerp(1.5, low, high)
      expect(result).toBe(13)
    })
  })

  describe("sizeToFit", () => {
    it("enlarge", () => {
      const width = 10
      const height = 5
      const result = GMath.sizeToFit(width, height, 20)
      expect(result).toStrictEqual({ width: 20, height: 10 })
    })

    it("reduce", () => {
      const width = 20
      const height = 10
      const result = GMath.sizeToFit(width, height, 10)
      expect(result).toStrictEqual({ width: 10, height: 5 })
    })
  })

  describe("sizeToCover", () => {
    it("enlarge", () => {
      const width = 10
      const height = 5
      const result = GMath.sizeToCover(width, height, 10)
      expect(result).toStrictEqual({ width: 20, height: 10 })
    })

    it("reduce", () => {
      const width = 20
      const height = 10
      const result = GMath.sizeToCover(width, height, 5)
      expect(result).toStrictEqual({ width: 10, height: 5 })
    })
  })
})
