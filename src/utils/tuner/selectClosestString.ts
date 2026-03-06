import { foldToTarget } from '../pitchMath';
import type { StringConfig } from '../../types';

export function selectClosestString(strings: StringConfig[], rawPitch: number): number {
    let bestIndex = 0;
    let bestDistance = Infinity;

    strings.forEach((stringConfig, index) => {
        const foldedPitch = foldToTarget(rawPitch, stringConfig.freq);
        const distance = Math.abs(foldedPitch - stringConfig.freq);

        if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = index;
        }
    });

    return bestIndex;
}
