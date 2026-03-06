import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { TunerStatus } from '../types';

interface UseAppGlowStyleOptions {
    accentColor: string;
    delta: number | null;
    isListening: boolean;
    isSilent: boolean;
    status: TunerStatus;
}

export function useAppGlowStyle({
    accentColor,
    delta,
    isListening,
    isSilent,
    status,
}: UseAppGlowStyleOptions): CSSProperties {
    return useMemo(() => {
        let glowColor = accentColor;
        let glowRadius = '20%';

        if (isListening && !isSilent && status !== 'idle') {
            if (status === 'low' || status === 'way_low') glowColor = 'var(--clr-low)';
            if (status === 'high' || status === 'way_high') glowColor = 'var(--clr-high)';
            if (status === 'perfect') glowColor = 'var(--clr-perfect)';

            if (delta !== null) {
                const clampedDelta = Math.min(Math.abs(delta), 30);
                const scaledRadius = 60 - (clampedDelta / 30) * 40;

                glowRadius = `${scaledRadius}%`;
            }
        }

        return {
            '--accent': accentColor,
            '--glow-base': glowColor,
            '--glow-radius': glowRadius,
        } as CSSProperties;
    }, [accentColor, delta, isListening, isSilent, status]);
}
