import type { TunerStatus } from '../types';

const CX = 150;
const CY = 160;
const INNER_R = 50;
const OUTER_R = 124;
const NEEDLE_LEN = 106;
const LBL_R = 143;
const GAP_W = 6;
const BG = '#080818';
const HUB_R = 20;

function mapAngle(delta: number, perfectCents: number, outerCents: number): number {
    const abs = Math.abs(delta);
    const sign = Math.sign(delta);

    if (abs <= perfectCents) {
        return sign * (abs / perfectCents) * 15;
    }

    const t = Math.min(1, (abs - perfectCents) / Math.max(1, outerCents - perfectCents));
    return sign * (15 + t * 75);
}

function ptG(angleDeg: number, r: number) {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function sector(startDeg: number, endDeg: number): string {
    const oS = ptG(startDeg, OUTER_R);
    const oE = ptG(endDeg, OUTER_R);
    const iS = ptG(startDeg, INNER_R);
    const iE = ptG(endDeg, INNER_R);
    const lg = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    return [
        `M ${oS.x.toFixed(2)} ${oS.y.toFixed(2)}`,
        `A ${OUTER_R} ${OUTER_R} 0 ${lg} 1 ${oE.x.toFixed(2)} ${oE.y.toFixed(2)}`,
        `L ${iE.x.toFixed(2)} ${iE.y.toFixed(2)}`,
        `A ${INNER_R} ${INNER_R} 0 ${lg} 0 ${iS.x.toFixed(2)} ${iS.y.toFixed(2)}`,
        'Z',
    ].join(' ');
}

interface Props {
    delta: number | null;
    isPerfect: boolean;
    accentColor: string;
    status: TunerStatus;
    labelTighten: string;
    labelPerfect: string;
    labelLoosen: string;
    perfectRange: number;
    warningRange: number;
    isSilent: boolean;
}

export function TunerGauge({
    delta,
    isPerfect,
    accentColor,
    status,
    labelTighten,
    labelPerfect,
    labelLoosen,
    perfectRange,
    warningRange,
    isSilent,
}: Props) {
    const needleAngle = delta !== null ? mapAngle(delta, perfectRange, warningRange) : 0;
    const isLow = status === 'low' || status === 'way_low';
    const isHigh = status === 'high' || status === 'way_high';
    const hasSignal = status !== 'idle' && status !== 'silent';

    const oTighten = isSilent ? 0.3 : !hasSignal ? 0.65 : isLow ? 1.0 : 0.42;
    const oPerfect = isSilent ? 0.3 : !hasSignal ? 0.65 : isPerfect ? 1.0 : 0.42;
    const oLoosen = isSilent ? 0.3 : !hasSignal ? 0.65 : isHigh ? 1.0 : 0.42;

    const saturation = isSilent ? 'grayscale(0.6)' : 'none';
    const lTighten = !hasSignal ? 0.5 : isLow ? 1.0 : 0.38;
    const lPerfect = !hasSignal ? 0.5 : isPerfect ? 1.0 : 0.38;
    const lLoosen = !hasSignal ? 0.5 : isHigh ? 1.0 : 0.38;
    const gapAngles = [-90, -15, 15, 90];

    return (
        <div className="gauge-wrap">
            <svg viewBox="0 0 300 185" className="gauge-svg" aria-hidden="true">
                <path d={sector(-90, -15)} fill="#4dabf7" opacity={oTighten} style={{ filter: saturation }} />
                <path
                    d={sector(-15, 15)}
                    fill={accentColor}
                    opacity={oPerfect}
                    style={{ filter: saturation }}
                    className={isPerfect && !isSilent ? 'sector-pulsing' : ''}
                />
                <path d={sector(15, 90)} fill="#ff6b6b" opacity={oLoosen} style={{ filter: saturation }} />

                {gapAngles.map(angle => {
                    const inner = ptG(angle, INNER_R - 2);
                    const outer = ptG(angle, OUTER_R + 2);
                    return (
                        <line
                            key={angle}
                            x1={inner.x.toFixed(2)}
                            y1={inner.y.toFixed(2)}
                            x2={outer.x.toFixed(2)}
                            y2={outer.y.toFixed(2)}
                            stroke={BG}
                            strokeWidth={GAP_W}
                            strokeLinecap="square"
                        />
                    );
                })}

                <g className="gauge-needle" style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
                    <polygon
                        points={`${CX},${CY - NEEDLE_LEN} ${CX - 5},${CY + 8} ${CX + 5},${CY + 8}`}
                        fill="white"
                        opacity={isSilent ? 0.4 : 0.95}
                    />
                </g>

                <circle cx={CX} cy={CY} r={HUB_R} fill={BG} />
                <circle cx={CX} cy={CY} r={13} fill={BG} stroke={accentColor} strokeWidth={2.5} />
                <circle cx={CX} cy={CY} r={5} fill="white" opacity={0.9} />

                <g transform={`rotate(-52.5, ${CX}, ${CY})`}>
                    <text x={CX} y={CY - LBL_R} className="gauge-sector-label" fill="#74c0fc" opacity={lTighten}>
                        {labelTighten}
                    </text>
                </g>

                <text x={CX} y={CY - LBL_R} className="gauge-sector-label" fill={accentColor} opacity={lPerfect}>
                    {labelPerfect}
                </text>

                <g transform={`rotate(52.5, ${CX}, ${CY})`}>
                    <text x={CX} y={CY - LBL_R} className="gauge-sector-label" fill="#ff8787" opacity={lLoosen}>
                        {labelLoosen}
                    </text>
                </g>
            </svg>
        </div>
    );
}
