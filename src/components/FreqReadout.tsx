import React, { useMemo } from 'react';
import type { Translations } from '../config/translations';

export interface TunerProps {
    hearingHz: number;
    targetHz: number;
    cents: number;
    isSilent: boolean;
    t: Translations;
    perfectRange: number;
}

export const FreqReadout = React.memo(function FreqReadout({
    hearingHz,
    targetHz,
    cents,
    isSilent,
    t,
    perfectRange
}: TunerProps) {
    // Determine state
    let stateClass = 'perfect';
    if (cents < -perfectRange) stateClass = 'flat';
    else if (cents > perfectRange) stateClass = 'sharp';

    // Clamp visual cents strictly for scale rendering range (-50 to +50)
    const visualCents = Math.max(-50, Math.min(50, cents));

    const ticks = useMemo(() => {
        const lines = [];
        for (let c = -50; c <= 50; c += 2) {
            const x = c * 4;
            const isMajor = c % 10 === 0;
            const isMid = c % 10 === 5 && !isMajor;
            // Height logic
            const height = isMajor ? 12 : isMid ? 8 : 5;

            lines.push(
                <line
                    key={c}
                    x1={x} y1={20 - height}
                    x2={x} y2={20}
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={isMajor ? 1.5 : 1}
                />
            );
            if (isMajor && c !== 0) {
                // adding numbers
                lines.push(
                    <text
                        key={`t${c}`}
                        x={x} y={30}
                        fill="rgba(255,255,255,0.5)"
                        fontSize="8"
                        fontFamily="var(--font-mono)"
                        textAnchor="middle"
                        fontWeight="bold"
                    >
                        {c > 0 ? `+${c}` : Math.abs(c)}
                    </text>
                );
            }
        }
        return lines;
    }, []);

    // Provide a standardized sign helper
    const sign = cents > 0 ? '+' : '';
    const deltaStr = `${sign}${cents.toFixed(1)}`;

    return (
        <div className={`aero-delta-container state-${stateClass} ${isSilent ? 'is-stale' : ''}`}>
            {/* Left Wing (Target) */}
            <div className="aero-wing aero-wing-left">
                <span className="aero-wing-label">{t.target}</span>
                <span className="aero-wing-value">{targetHz.toFixed(1)} <small>Hz</small></span>
            </div>

            {/* Scale Center container */}
            <div className="aero-center">
                <div className="aero-delta-text">
                    <span className="aero-delta-val">{isSilent ? "---" : deltaStr}</span>
                </div>

                <div className="aero-vernier">
                    {/* The sliding scale */}
                    <div
                        className="aero-vernier-scale"
                        style={{ transform: `translateX(${-visualCents * 4}px)` }}
                    >
                        <svg viewBox="-200 0 400 36" width="400" height="36" preserveAspectRatio="xMidYMid meet">
                            {ticks}
                            <polygon points="0,5 -3,0 3,0" fill="rgba(255,255,255,0.8)" />
                        </svg>
                    </div>

                    {/* The glowing glass needle in center (static) */}
                    <div className="aero-vernier-needle" />
                </div>
            </div>

            {/* Right Wing (Hearing) */}
            <div className="aero-wing aero-wing-right">
                <span className="aero-wing-label">{t.hearing}</span>
                <span className="aero-wing-value">{isSilent ? "---" : hearingHz.toFixed(1)} <small>Hz</small></span>
            </div>
        </div>
    );
});
