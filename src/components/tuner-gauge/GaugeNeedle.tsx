import {
    GAUGE_CENTER_X,
    GAUGE_CENTER_Y,
    GAUGE_NEEDLE_LENGTH,
} from './constants';

interface GaugeNeedleProps {
    angle: number;
    accentColor: string;
    hasSignal: boolean;
    isPerfect: boolean;
    isSilent: boolean;
}

export function GaugeNeedle({
    angle,
    accentColor,
    hasSignal,
    isPerfect,
    isSilent,
}: GaugeNeedleProps) {
    return (
        <g
            className="gauge-needle-group"
            style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${GAUGE_CENTER_X}px ${GAUGE_CENTER_Y}px` }}
        >
            <circle
                cx={GAUGE_CENTER_X}
                cy={GAUGE_CENTER_Y - GAUGE_NEEDLE_LENGTH - 4}
                r={4}
                fill={isPerfect && hasSignal ? accentColor : '#fff'}
                opacity={isSilent ? 0 : 1}
                style={{ filter: 'url(#glow-heavy)', transition: 'fill 0.3s' }}
            />
            <path
                d={`M ${GAUGE_CENTER_X - 2} ${GAUGE_CENTER_Y} L ${GAUGE_CENTER_X - 1} ${GAUGE_CENTER_Y - GAUGE_NEEDLE_LENGTH} L ${GAUGE_CENTER_X + 1} ${GAUGE_CENTER_Y - GAUGE_NEEDLE_LENGTH} L ${GAUGE_CENTER_X + 2} ${GAUGE_CENTER_Y} Z`}
                fill="url(#needle-grad)"
                opacity={isSilent ? 0.2 : 0.8}
            />
        </g>
    );
}
