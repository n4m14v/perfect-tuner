/** Cents — pitch must be within this range to enter the "perfect" zone */
export const PERFECT_RANGE_CENTS = 10;

/** Cents — pitch must exceed this range to EXIT the "perfect" zone (hysteresis buffer) */
export const PERFECT_EXIT_CENTS = 15;

/** Cents — frequency is this far off before showing a "way high/low" warning */
export const WARNING_RANGE_CENTS = 50;
