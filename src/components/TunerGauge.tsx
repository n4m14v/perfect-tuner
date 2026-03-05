import type { TunerStatus } from '../types';

const CX = 150;
const CY = 155; // Slightly higher to fit better
const INNER_R = 90;
const OUTER_R = 120;
const NEEDLE_LEN = 110;
const TICK_R = 125;

function mapAngle(delta: number, perfectCents: number, outerCents: number): number {
    const abs = Math.abs(delta);
    const sign = Math.sign(delta);

    if (abs <= perfectCents) {
        return sign * (abs / perfectCents) * 15;
    }

    const t = Math.min(1, (abs - perfectCents) / Math.max(1, outerCents - perfectCents));
    return sign * (15 + t * 65); // Cap needle at +/- 80 degrees
}

function ptG(angleDeg: number, r: number) {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// Draw a single curved line for the sector
function sectorLine(startDeg: number, endDeg: number, r: number): string {
    const start = ptG(startDeg, r);
    const end = ptG(endDeg, r);
    const lg = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${lg} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
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
    const hasSignal = status !== 'idle' && status !== 'silent';

    // Opacities for the three main bands
    const oLow = isSilent ? 0.15 : !hasSignal ? 0.3 : (status === 'low' || status === 'way_low') ? 1.0 : 0.2;
    const oPerf = isSilent ? 0.15 : !hasSignal ? 0.3 : isPerfect ? 1.0 : 0.2;
    const oHigh = isSilent ? 0.15 : !hasSignal ? 0.3 : (status === 'high' || status === 'way_high') ? 1.0 : 0.2;

    // Convert named accent color back to raw hex/rgb if needed, but we rely on CSS variables or the raw string
    const trackColor = 'rgba(255,255,255,0.05)';

    return (
        <div className="gauge-wrap">
            <svg viewBox="0 0 300 180" className="gauge-svg" aria-hidden="true">
                <defs>
                    <linearGradient id="needle-grad" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                        <stop offset="40%" stopColor="#fff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#fff" stopOpacity="1" />
                    </linearGradient>

                    {/* Glow filter for active states */}
                    <filter id="glow-heavy" filterUnits="userSpaceOnUse" x="-100" y="-100" width="500" height="500">
                        <feGaussianBlur stdDeviation="12" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    {/* Glowing tip */}
                </defs>

                {/* Base background track (3 distinct segments) */}
                <path d={sectorLine(-80, -16, OUTER_R)} fill="none" stroke={trackColor} strokeWidth="12" strokeLinecap="round" />
                <path d={sectorLine(-10, 10, OUTER_R)} fill="none" stroke={trackColor} strokeWidth="12" strokeLinecap="round" />
                <path d={sectorLine(16, 80, OUTER_R)} fill="none" stroke={trackColor} strokeWidth="12" strokeLinecap="round" />

                <path d={sectorLine(-80, 80, INNER_R)} fill="none" stroke={trackColor} strokeWidth="2" strokeLinecap="round" />

                {/* Active Colored Segments - Solid context colors */}
                {/* 1. Low Segment */}
                <path
                    d={sectorLine(-80, -16, OUTER_R)}
                    fill="none"
                    stroke="var(--clr-low)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    opacity={oLow}
                    style={{ filter: (oLow > 0.5 && hasSignal) ? 'url(#glow-heavy)' : 'none', transition: 'opacity 0.3s, filter 0.3s' }}
                />

                {/* 2. Perfect Segment */}
                <path
                    d={sectorLine(-10, 10, OUTER_R)}
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="12"
                    strokeLinecap="round"
                    opacity={oPerf}
                    style={{ filter: (oPerf > 0.5 && hasSignal) ? 'url(#glow-heavy)' : 'none', transition: 'opacity 0.3s, filter 0.3s' }}
                />

                {/* 3. High Segment */}
                <path
                    d={sectorLine(16, 80, OUTER_R)}
                    fill="none"
                    stroke="var(--clr-high)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    opacity={oHigh}
                    style={{ filter: (oHigh > 0.5 && hasSignal) ? 'url(#glow-heavy)' : 'none', transition: 'opacity 0.3s, filter 0.3s' }}
                />

                {/* Tick marks */}
                {[-60, -40, -20, 0, 20, 40, 60].map(angle => {
                    const i = ptG(angle, TICK_R);
                    const o = ptG(angle, TICK_R + 6);
                    const isCenter = angle === 0;
                    return (
                        <line
                            key={angle}
                            x1={i.x.toFixed(2)} y1={i.y.toFixed(2)}
                            x2={o.x.toFixed(2)} y2={o.y.toFixed(2)}
                            stroke={isCenter ? accentColor : 'rgba(255,255,255,0.2)'}
                            strokeWidth={isCenter ? 3 : 2}
                            strokeLinecap="round"
                        />
                    );
                })}

                {/* Needle */}
                <g className="gauge-needle-group" style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
                    {/* Glowing tip */}
                    <circle
                        cx={CX}
                        cy={CY - NEEDLE_LEN - 4}
                        r={4}
                        fill={isPerfect && hasSignal ? accentColor : "#fff"}
                        opacity={isSilent ? 0 : 1}
                        style={{ filter: 'url(#glow-heavy)', transition: 'fill 0.3s' }}
                    />

                    {/* Main needle body */}
                    <path
                        d={`M ${CX - 2} ${CY} L ${CX - 1} ${CY - NEEDLE_LEN} L ${CX + 1} ${CY - NEEDLE_LEN} L ${CX + 2} ${CY} Z`}
                        fill="url(#needle-grad)"
                        opacity={isSilent ? 0.2 : 0.8}
                    />
                </g>

                {/* Center Hub */}
                <circle cx={CX} cy={CY} r={16} fill="var(--bg-panel)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <circle cx={CX} cy={CY} r={6} fill={hasSignal ? accentColor : "rgba(255,255,255,0.3)"} style={{ transition: 'fill 0.3s' }} />

                {/* Text Labels */}
                <g>
                    {(() => {
                        const LABEL_R = (INNER_R + OUTER_R) / 2;
                        const angleTighten = -48;
                        const angleLoosen = 48;

                        const ptT = ptG(angleTighten, LABEL_R);
                        const ptL = ptG(angleLoosen, LABEL_R);

                        return (
                            <>
                                <text
                                    x={ptT.x}
                                    y={ptT.y}
                                    transform={`rotate(${angleTighten}, ${ptT.x}, ${ptT.y})`}
                                    fill={oLow > 0.5 ? "var(--clr-low)" : "var(--clr-text-muted)"}
                                    fontSize={oLow > 0.5 ? "11" : "10"}
                                    fontWeight={oLow > 0.5 ? "bold" : "normal"}
                                    fontFamily="var(--font-mono)"
                                    letterSpacing="0.1em"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    opacity={oLow > 0.3 ? 1 : 0.5}
                                    style={{ filter: oLow > 0.5 ? 'url(#glow-heavy)' : 'none', transition: 'all 0.3s' }}
                                >
                                    {labelTighten}
                                </text>
                                <text
                                    x={CX}
                                    y={CY - LABEL_R}
                                    fill={oPerf > 0.5 ? accentColor : "var(--clr-text-muted)"}
                                    fontSize="11"
                                    fontWeight="bold"
                                    fontFamily="var(--font-mono)"
                                    letterSpacing="0.1em"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    style={{ filter: oPerf > 0.5 ? 'url(#glow-heavy)' : 'none', transition: 'all 0.3s' }}
                                >
                                    {labelPerfect}
                                </text>
                                <text
                                    x={ptL.x}
                                    y={ptL.y}
                                    transform={`rotate(${angleLoosen}, ${ptL.x}, ${ptL.y})`}
                                    fill={oHigh > 0.5 ? "var(--clr-high)" : "var(--clr-text-muted)"}
                                    fontSize={oHigh > 0.5 ? "11" : "10"}
                                    fontWeight={oHigh > 0.5 ? "bold" : "normal"}
                                    fontFamily="var(--font-mono)"
                                    letterSpacing="0.1em"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    opacity={oHigh > 0.3 ? 1 : 0.5}
                                    style={{ filter: oHigh > 0.5 ? 'url(#glow-heavy)' : 'none', transition: 'all 0.3s' }}
                                >
                                    {labelLoosen}
                                </text>
                            </>
                        );
                    })()}
                </g>
            </svg>
        </div>
    );
}
