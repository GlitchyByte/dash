// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect } from "vitest"
import { greet } from "../src"

describe("greet", () => {
  it("should return full greeting", () => {
    expect(greet("dude")).toBe("Hello, dude!")
  })
})
