// Copyright 2024-2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

/**
 * Math utilities.
 */
export class GMath {

  /**
   * Return the smallest value.
   *
   * This is way faster than Math.min for two values.
   *
   * @param v1 The 1st value.
   * @param v2 The 2nd value.
   * @return The smallest value.
   */
  public static min(v1: number, v2: number): number {
    return v1 < v2 ? v1 : v2
  }

  /**
   * Return the largest value.
   *
   * This is way faster than Math.max for two values.
   *
   * @param v1 The 1st value.
   * @param v2 The 2nd value.
   * @return The largest value.
   */
  public static max(v1: number, v2: number): number {
    return v1 > v2 ? v1 : v2
  }

  /**
   * Returns a random float within range [0, limit)
   *
   * @param limit The upper exclusive limit of the range.
   * @return A random float.
   */
  public static random(limit: number): number {
    return Math.random() * limit
  }

  /**
   * Returns a random float within range [low, high)
   *
   * @param low The lower inclusive limit.
   * @param high The upper exclusive limit.
   * @return A random float.
   */
  public static randomRange(low: number, high: number): number {
    return low + GMath.random(high - low)
  }

  /**
   * Returns a random int within range [0, limit)
   *
   * @param limit The upper exclusive limit of the range.
   * @return A random int.
   */
  public static randomUInt(limit: number): number {
    return Math.trunc(Math.random() * limit)
  }

  /**
   * Returns a random int within range [low, high)
   *
   * @param low The lower inclusive limit.
   * @param high The upper exclusive limit.
   * @return A random int.
   */
  public static randomUIntRange(low: number, high: number): number {
    return low + GMath.randomUInt(high - low)
  }

  /**
   * Returns a random "true" or "false" value.
   *
   * @param truthProbability The probability of returning true. Default is 50%.
   * @return A random int.
   */
  public static randomBoolean(truthProbability = 0.5): boolean {
    return Math.random() < truthProbability
  }

  /**
   * Returns a random index picked according to its weight.
   *
   * @param weights An array of weights.
   */
  public static randomWeightIndex(weights: number[]): number {
    const total = weights.reduce((previousValue, currentValue) => previousValue + currentValue)
    const r = GMath.random(total)
    let acc = 0
    for (let i = 0; i < weights.length; ++i) {
      acc += weights[i]
      if (r < acc) {
        return i
      }
    }
    // Floating point errors go to the last item.
    return weights[weights.length - 1]
  }

  /**
   * Returns the calculated average of adding one more value to a previous average.
   *
   * @param count Item count including the new one.
   * @param previousAverage Average so far.
   * @param value New item to add to average.
   */
  public static rollingAverage(count: number, previousAverage: number, value: number): number {
    return ((previousAverage * (count - 1)) + value) / count
  }

  /**
   * Returns the clamped value, no lower than low and not higher than high.
   *
   * @param value Value to clamp.
   * @param low Low limit.
   * @param high High limit.
   */
  public static clamp(value: number, low: number, high: number): number {
    if (value < low) {
      return low
    }
    if (value > high) {
      return high
    }
    return value
  }

  /**
   * Linear interpolation between two values.
   *
   * @param x Interpolation value. 0 aligns to low, 1 aligns to high.
   * @param low Low limit.
   * @param high High limit.
   */
  public static lerp(x: number, low: number, high: number): number {
    return low + ((high - low) * x)
  }

  /**
   * Returns a rectangle that fits the given rectangle of the given width and height into
   * an enclosing rectangle whose large side is maxSide, maintaining aspect ratio.
   *
   * @param width Width of a rectangle.
   * @param height Height of a rectangle.
   * @param maxSize Larger side of the enclosing rectangle.
   */
  public static sizeToFit(width: number, height: number, maxSize: number): { width: number, height: number } {
    const scale = maxSize / GMath.max(width, height)
    return {
      width: Math.round(width * scale),
      height: Math.round(height * scale)
    }
  }

  /**
   * Returns a rectangle that covers the enclosing rectangle whose smaller side is minSide with
   * the given rectangle of the given width and height, maintaining aspect ratio.
   *
   * @param width Width of a rectangle.
   * @param height Height of a rectangle.
   * @param minSize Smaller side of the enclosing rectangle.
   */
  public static sizeToCover(width: number, height: number, minSize: number): { width: number, height: number } {
    const scale = minSize / GMath.min(width, height)
    return {
      width: Math.round(width * scale),
      height: Math.round(height * scale)
    }
  }
}
