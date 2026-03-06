import {
    GAUGE_CENTER_X,
    GAUGE_CENTER_Y,
    GAUGE_INNER_RADIUS,
} from './constants';
import { getGaugePoint } from './geometry';
import type { GaugeBandOpacities } from './types';

interface GaugeLabelsProps {
    accentColor: string;
    bandOpacities: GaugeBandOpacities;
    labelLoosen: string;
    labelPerfect: string;
    labelTighten: string;
}

const LABEL_RADIUS = GAUGE_INNER_RADIUS + 10;
const TIGHTEN_ANGLE = -48;
const LOOSEN_ANGLE = 48;

export function GaugeLabels({
    accentColor,
    bandOpacities,
    labelLoosen,
    labelPerfect,
    labelTighten,
}: GaugeLabelsProps) {
    const tightenPoint = getGaugePoint(TIGHTEN_ANGLE, LABEL_RADIUS);
    const loosenPoint = getGaugePoint(LOOSEN_ANGLE, LABEL_RADIUS);

    return (
        <g>
            <text
                x={tightenPoint.x}
                y={tightenPoint.y}
                transform={`rotate(${TIGHTEN_ANGLE}, ${tightenPoint.x}, ${tightenPoint.y})`}
                fill={bandOpacities.low > 0.5 ? 'var(--clr-low)' : 'var(--clr-text-muted)'}
                fontSize={bandOpacities.low > 0.5 ? '11' : '10'}
                fontWeight={bandOpacities.low > 0.5 ? 'bold' : 'normal'}
                fontFamily="var(--font-mono)"
                letterSpacing="0.1em"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={bandOpacities.low > 0.3 ? 1 : 0.5}
                style={{ filter: bandOpacities.low > 0.5 ? 'url(#glow-heavy)' : 'none', transition: 'all 0.3s' }}
            >
                {labelTighten}
            </text>
            <text
                x={GAUGE_CENTER_X}
                y={GAUGE_CENTER_Y - LABEL_RADIUS}
                fill={bandOpacities.perfect > 0.5 ? accentColor : 'var(--clr-text-muted)'}
                fontSize="11"
                fontWeight="bold"
                fontFamily="var(--font-mono)"
                letterSpacing="0.1em"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ filter: bandOpacities.perfect > 0.5 ? 'url(#glow-heavy)' : 'none', transition: 'all 0.3s' }}
            >
                {labelPerfect}
            </text>
            <text
                x={loosenPoint.x}
                y={loosenPoint.y}
                transform={`rotate(${LOOSEN_ANGLE}, ${loosenPoint.x}, ${loosenPoint.y})`}
                fill={bandOpacities.high > 0.5 ? 'var(--clr-high)' : 'var(--clr-text-muted)'}
                fontSize={bandOpacities.high > 0.5 ? '11' : '10'}
                fontWeight={bandOpacities.high > 0.5 ? 'bold' : 'normal'}
                fontFamily="var(--font-mono)"
                letterSpacing="0.1em"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={bandOpacities.high > 0.3 ? 1 : 0.5}
                style={{ filter: bandOpacities.high > 0.5 ? 'url(#glow-heavy)' : 'none', transition: 'all 0.3s' }}
            >
                {labelLoosen}
            </text>
        </g>
    );
}
