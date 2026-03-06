import {
    GAUGE_HIGH_END_DEG,
    GAUGE_HIGH_START_DEG,
    GAUGE_LOW_END_DEG,
    GAUGE_LOW_START_DEG,
    GAUGE_OUTER_RADIUS,
    GAUGE_PERFECT_END_DEG,
    GAUGE_PERFECT_START_DEG,
} from './constants';
import { getGaugePoint, getSectorLine } from './geometry';
import type { GaugeBandOpacities } from './types';

interface GaugeDefsProps {
    bandOpacities: GaugeBandOpacities;
}

export function GaugeDefs({ bandOpacities }: GaugeDefsProps) {
    return (
        <defs>
            <linearGradient id="needle-grad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                <stop offset="40%" stopColor="#fff" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#fff" stopOpacity="1" />
            </linearGradient>

            <filter id="glow-heavy" filterUnits="userSpaceOnUse" x="-100" y="-100" width="500" height="500">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <mask id="arc-mask">
                <g opacity={bandOpacities.low} style={{ transition: 'opacity 0.3s' }}>
                    <path d={getSectorLine(GAUGE_LOW_START_DEG, GAUGE_LOW_END_DEG, GAUGE_OUTER_RADIUS)} fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="butt" />
                    <circle cx={getGaugePoint(GAUGE_LOW_START_DEG, GAUGE_OUTER_RADIUS).x} cy={getGaugePoint(GAUGE_LOW_START_DEG, GAUGE_OUTER_RADIUS).y} r={6} fill="#fff" />
                </g>

                <g opacity={bandOpacities.perfect} style={{ transition: 'opacity 0.3s' }}>
                    <path d={getSectorLine(GAUGE_PERFECT_START_DEG, GAUGE_PERFECT_END_DEG, GAUGE_OUTER_RADIUS)} fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="butt" />
                </g>

                <g opacity={bandOpacities.high} style={{ transition: 'opacity 0.3s' }}>
                    <path d={getSectorLine(GAUGE_HIGH_START_DEG, GAUGE_HIGH_END_DEG, GAUGE_OUTER_RADIUS)} fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="butt" />
                    <circle cx={getGaugePoint(GAUGE_HIGH_END_DEG, GAUGE_OUTER_RADIUS).x} cy={getGaugePoint(GAUGE_HIGH_END_DEG, GAUGE_OUTER_RADIUS).y} r={6} fill="#fff" />
                </g>
            </mask>
        </defs>
    );
}
