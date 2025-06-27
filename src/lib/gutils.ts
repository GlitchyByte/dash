// Copyright 2023-2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

// Common utils.

// import { GByteBuffer } from "./GByteBuffer"
import { GMath } from "./GMath"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true })

/**
 * Converts utf-8 string to bytes.
 *
 * @param str Utf-8 string to convert.
 */
export function stringToBytes(str: string): Uint8Array {
  return textEncoder.encode(str)
}

/**
 * Converts bytes to utf-8 string.
 *
 * @param bytes Bytes to convert.
 */
export function bytesToString(bytes: Uint8Array): string {
  return textDecoder.decode(bytes)
}

/**
 * Converts number value into a hex string.
 *
 * @param value Value to convert.
 * @param minLength Minimum length of output string. Output will be padded with 0s if less.
 * @param uppercase Flag to make the resulting hex characters uppercase.
 * @return A hex string.
 */
export function numberToHexString(value: number, minLength = 1, uppercase = false): string {
  if (value === 0) {
    return "0".repeat(minLength)
  }
  let str = ""
  const hexDigits = uppercase ? "0123456789ABCDEF" : "0123456789abcdef"
  while (value !== 0) {
    const digit = value & 0x0f
    str = hexDigits[digit] + str
    value >>>= 4
  }
  return str.padStart(minLength, "0")
}

/**
 * Converts number value into a binary string.
 *
 * @param value Value to convert.
 * @param minLength Minimum length of output string. Output will be padded with 0s if less.
 */
export function numberToBinaryString(value: number, minLength = 1): string {
  if (value === 0) {
    return "0".repeat(minLength)
  }
  let str = ""
  while (value !== 0) {
    const digit = value & 1
    str = (digit ? "1" : "0") + str
    value >>>= 1
  }
  return str.padStart(minLength, "0")
}

/**
 * Convenience function to separate groups of characters and insert a separator string between them.
 *
 * For example, to separate nibbles or bytes on a binary string, or bytes on a hex string.
 * ```ts
 * const binStr = separatedString("10011001", 4) // "1001 1001"
 * ```
 *
 * @param str String to insert separators.
 * @param every Count of characters to insert separator in between.
 * @param separator Separator string.
 * @param rightToLeft If count should start from right to left or left to right.
 */
export function separatedString(str: string, every: number, separator: string = " ", rightToLeft: boolean = true): string {
  const count = Math.trunc(str.length / every)
  const remainder = str.length - (count * every)
  let result = ""
  if (rightToLeft) {
    for (let i = 1; i <= count; ++i) {
      const offset = str.length - (i * every)
      const piece = str.slice(offset, offset + every)
      result = piece + (i === 1 ? "" : separator + result)
    }
    if (remainder > 0) {
      const piece = str.slice(0, remainder)
      result = piece + separator + result
    }
  } else {
    for (let i = 0; i < count; ++i) {
      const offset = i * every
      result += (i === 0 ? "" : separator) + str.slice(offset, offset + every)
    }
    if (remainder > 0) {
      result += separator + str.slice(-remainder)
    }
  }
  return result
}

/**
 * Fisher-Yates in-place array shuffler.
 *
 * @param array Array to shuffle.
 */
export function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; --i) {
    const index = GMath.randomUInt(i)
    const temp = array[i]
    array[i] = array[index]
    array[index] = temp
  }
}

/**
 * Returns a random item from the given array.
 *
 * @param array Array from which to pick an item.
 */
export function pickRandomArrayItem<T>(array: T[]): T | null {
  const length = array.length
  if (length === 0) {
    return null
  }
  const index = GMath.randomUInt(length)
  return array[index]
}

/**
 * Returns the values of the query params specified, in the same order.
 *
 * @param params Query param names to get.
 */
export function getQueryParams(...params: string[]): (string | null)[] {
  const urlParams = new URLSearchParams(window.location.search)
  const values: (string | null)[] = []
  for (const param of params) {
    values.push(urlParams.get(param))
  }
  return values
}

/**
 * Runs func in the next cycle.
 *
 * @param func Function to run.
 */
export function deferRun(func: () => void): void {
  setTimeout(func, 0)
}
