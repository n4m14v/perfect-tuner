import type { GaugeBandOpacities } from './types';
import type { TunerStatus } from '../../types';

export function getGaugeBandOpacities(status: TunerStatus, isPerfect: boolean, isSilent: boolean): GaugeBandOpacities {
    const hasSignal = status !== 'idle' && status !== 'silent';

    return {
        low: isSilent ? 0.15 : !hasSignal ? 0.3 : (status === 'low' || status === 'way_low') ? 1 : 0.2,
        perfect: isSilent ? 0.15 : !hasSignal ? 0.3 : isPerfect ? 1 : 0.2,
        high: isSilent ? 0.15 : !hasSignal ? 0.3 : (status === 'high' || status === 'way_high') ? 1 : 0.2,
    };
}
