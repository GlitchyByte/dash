// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

export type TimeUnit = "ms" | "s" | "m" | "h" | "d" | "w"
export type TimeDurationSpec = number | `${number}${TimeUnit}`

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR= 60 * MINUTE
const DAY= 24 * HOUR
const WEEK= 7 * DAY

function fromTimeDurationSpec(duration: TimeDurationSpec): number {
  if (typeof duration === "number") {
    return duration
  }
  const match = duration.match(/^(\d+(?:\.\d+)?)(ms|s|m|h|d|w)$/)!
  const n = parseFloat(match[1])
  const unit = match[2] as TimeUnit
  switch (unit) {
    case "ms": return n
    case "s": return n * SECOND
    case "m": return n * MINUTE
    case "h": return n * HOUR
    case "d": return n * DAY
    case "w": return n * WEEK
  }
}

/**
 * Resolves a time duration spec and return the quantity of given units.
 *
 * @param duration Duration spec.
 * @param toUnit Unit to convert to. If omitted, it will resolve to ms.
 */
export function resolveTimeDuration(duration: TimeDurationSpec, toUnit: TimeUnit = "ms"): number {
  const ms = fromTimeDurationSpec(duration)
  switch (toUnit) {
    case "ms": return ms
    case "s": return ms / SECOND
    case "m": return ms / MINUTE
    case "h": return ms / HOUR
    case "d": return ms / DAY
    case "w": return ms / WEEK
  }
}

/**
 * Returns the time duration as a string with units.
 *
 * @param durationInMs Duration to convert.
 * @param toUnit Unit to convert to. If omitted, a full string with multiple units is returned.
 */
export function timeDurationToString(durationInMs: number, toUnit: TimeUnit | "full" = "full"): string {
  if (toUnit !== "full") {
    switch (toUnit) {
      case "ms": return `${durationInMs}ms`
      case "s": return `${durationInMs / SECOND}s`
      case "m": return `${durationInMs / MINUTE}m`
      case "h": return `${durationInMs / HOUR}h`
      case "d": return `${durationInMs / DAY}d`
      case "w": return `${durationInMs / WEEK}w`
    }
  }
  let remainder = durationInMs
  const weeks = Math.trunc(remainder / WEEK)
  remainder %= WEEK
  const days = Math.trunc(remainder / DAY)
  remainder %= DAY
  const hours = Math.trunc(remainder / HOUR)
  remainder %= HOUR
  const minutes = Math.trunc(remainder / MINUTE)
  remainder %= MINUTE
  const seconds = Math.trunc(remainder / SECOND)
  remainder %= SECOND
  const ms = Math.round(remainder * 1000) / 1000
  let result = ""
  if (weeks > 0) {
    result += `${weeks}w`
  }
  if (days > 0) {
    const separator = result.length > 0 ? " " : ""
    result += `${separator}${days}d`
  }
  if (hours > 0) {
    const separator = result.length > 0 ? " " : ""
    result += `${separator}${hours}h`
  }
  if (minutes > 0) {
    const separator = result.length > 0 ? " " : ""
    result += `${separator}${minutes}m`
  }
  if (seconds > 0) {
    const separator = result.length > 0 ? " " : ""
    result += `${separator}${seconds}s`
  }
  if (ms > 0) {
    const separator = result.length > 0 ? " " : ""
    result += `${separator}${ms}ms`
  }
  return result
}
