import { WARNING_RANGE_CENTS } from '../../constants/tuner';
import type { TunerStatus } from '../../types';

interface GetTunerStatusOptions {
    isListening: boolean;
    isSilent: boolean;
    isPerfect: boolean;
    delta: number | null;
}

export function getTunerStatus({
    isListening,
    isSilent,
    isPerfect,
    delta,
}: GetTunerStatusOptions): TunerStatus {
    if (!isListening) return 'idle';
    if (isSilent) return 'silent';
    if (isPerfect) return 'perfect';
    if (delta === null) return 'silent';

    if (delta < 0) {
        return Math.abs(delta) > WARNING_RANGE_CENTS ? 'way_low' : 'low';
    }

    if (delta > 0) {
        return Math.abs(delta) > WARNING_RANGE_CENTS ? 'way_high' : 'high';
    }

    return 'silent';
}
