export default class MathUtils {
    /**
     * Clamps number to range between min and max.
     * @param num limit.
     * @param min minimal.
     * @param max maximum.
     */
    static clamp(num: number, min: number, max: number): number {
        return Math.max(min, Math.min(num, max));
    }
  }