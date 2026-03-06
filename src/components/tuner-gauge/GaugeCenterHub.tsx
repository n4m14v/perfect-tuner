import {
    GAUGE_CENTER_X,
    GAUGE_CENTER_Y,
} from './constants';

interface GaugeCenterHubProps {
    autoMode: boolean;
    onToggleAuto: (value: boolean) => void;
}

export function GaugeCenterHub({ autoMode, onToggleAuto }: GaugeCenterHubProps) {
    return (
        <g
            className="gauge-center-hub"
            onClick={() => onToggleAuto(!autoMode)}
            style={{ cursor: 'pointer', pointerEvents: 'all' }}
        >
            <circle
                cx={GAUGE_CENTER_X}
                cy={GAUGE_CENTER_Y}
                r={22}
                fill="var(--bg-panel)"
                stroke={autoMode ? 'rgba(0, 240, 255, 0.6)' : 'rgba(255,255,255,0.15)'}
                strokeWidth="2"
                style={{ filter: autoMode ? 'url(#glow-heavy)' : 'none', transition: 'all 0.3s' }}
            />
            <text
                x={GAUGE_CENTER_X}
                y={GAUGE_CENTER_Y + 1}
                fill={autoMode ? '#0ff' : 'rgba(255,255,255,0.4)'}
                fontSize="9"
                fontWeight="bold"
                fontFamily="var(--font-mono)"
                letterSpacing="0.1em"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ filter: autoMode ? 'drop-shadow(0 0 4px rgba(0,255,255,0.8))' : 'none', transition: 'all 0.3s' }}
            >
                AUTO
            </text>
        </g>
    );
}
