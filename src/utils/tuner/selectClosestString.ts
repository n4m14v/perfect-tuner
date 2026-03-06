import { foldToTarget, getCentsDiff } from '../pitchMath';
import type { StringConfig } from '../../types';

const SWITCH_HYSTERESIS_CENTS = 8;

export function selectClosestString(strings: StringConfig[], rawPitch: number, currentIndex: number | null = null): number {
    let bestIndex = 0;
    let bestDistance = Infinity;

    strings.forEach((stringConfig, index) => {
        const foldedPitch = foldToTarget(rawPitch, stringConfig.freq);
        const distance = Math.abs(getCentsDiff(foldedPitch, stringConfig.freq));

        if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = index;
        }
    });

    if (currentIndex !== null) {
        const currentTarget = strings[currentIndex];
        const foldedPitch = foldToTarget(rawPitch, currentTarget.freq);
        const currentDistance = Math.abs(getCentsDiff(foldedPitch, currentTarget.freq));

        if (currentDistance <= bestDistance + SWITCH_HYSTERESIS_CENTS) {
            return currentIndex;
        }
    }

    return bestIndex;
}
