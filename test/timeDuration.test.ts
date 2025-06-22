// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { timeDurationToString, resolveTimeDuration } from "../src"

describe("duration", () => {
  describe("resolveDuration default ms", () => {
    it("500", () => {
      const duration = resolveTimeDuration(500)
      expect(duration).toBe(500)
    })

    it("700.3ms", () => {
      const duration = resolveTimeDuration("700.3ms")
      expect(duration).toBe(700.3)
    })

    it("10s", () => {
      const duration = resolveTimeDuration("10s")
      expect(duration).toBe(10_000)
    })

    it("0.5m", () => {
      const duration = resolveTimeDuration("0.5m")
      expect(duration).toBe(30_000)
    })

    it("2h", () => {
      const duration = resolveTimeDuration("2h")
      expect(duration).toBe(2 * 60 * 60 * 1_000)
    })

    it("3d", () => {
      const duration = resolveTimeDuration("3d")
      expect(duration).toBe(3 * 24 * 60 * 60 * 1_000)
    })

    it("4w", () => {
      const duration = resolveTimeDuration("4w")
      expect(duration).toBe(4 * 7 * 24 * 60 * 60 * 1_000)
    })
  })

  describe("resolveDuration with TimeUnit", () => {
    it("4w -> d", () => {
      const duration = resolveTimeDuration("4w", "h")
      expect(duration).toBe(4 * 7 * 24)
    })

    it("2d -> m", () => {
      const duration = resolveTimeDuration("2d", "m")
      expect(duration).toBe(2 * 24 * 60)
    })

    it("3h -> s", () => {
      const duration = resolveTimeDuration("3h", "s")
      expect(duration).toBe(3 * 60 * 60)
    })

    it("6h -> d", () => {
      const duration = resolveTimeDuration("6h", "d")
      expect(duration).toBe(0.25)
    })

    it("14d -> w", () => {
      const duration = resolveTimeDuration("14d", "w")
      expect(duration).toBe(2)
    })

    it("0.5h -> ms", () => {
      const duration = resolveTimeDuration("0.5h", "ms")
      expect(duration).toBe(0.5 * 60 * 60 * 1_000)
    })
  })

  describe("durationToString with TimeUnit", () => {
    it("100 -> ms", () => {
      const duration = timeDurationToString(100, "ms")
      expect(duration).toBe("100ms")
    })

    it("100 -> s", () => {
      const duration = timeDurationToString(100, "s")
      expect(duration).toBe("0.1s")
    })

    it("1h -> m", () => {
      const duration = timeDurationToString(resolveTimeDuration("1h"), "m")
      expect(duration).toBe("60m")
    })

    it("30m -> h", () => {
      const duration = timeDurationToString(resolveTimeDuration("30m"), "h")
      expect(duration).toBe("0.5h")
    })

    it("half a day in ms -> d", () => {
      const duration = timeDurationToString(0.5 * 24 * 60 * 60 * 1_000, "d")
      expect(duration).toBe("0.5d")
    })

    it("14d -> w", () => {
      const duration = timeDurationToString(resolveTimeDuration("14d"), "w")
      expect(duration).toBe("2w")
    })
  })

  describe("durationToString default full string", () => {
    it("7.5d", () => {
      const duration = timeDurationToString(resolveTimeDuration("7.5d"))
      expect(duration).toBe("1w 12h")
    })

    it("a day and change", () => {
      const duration = timeDurationToString(resolveTimeDuration("1d") + 1234.567)
      expect(duration).toBe("1d 1s 234.567ms")
    })

    it("a day and a bit more change", () => {
      const duration = timeDurationToString(resolveTimeDuration("1d") + resolveTimeDuration("5m") + 1234.5678)
      expect(duration).toBe("1d 5m 1s 234.568ms")
    })
  })
})
