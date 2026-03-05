import { Translations } from '../config/translations';

interface Props {
    currentFreq: number;
    targetFreq: number;
    deltaCents: number;
    isSilent: boolean;
    t: Translations;
    warningRange: number;
    perfectRange: number;
    accentColor: string;
}

export function FreqReadout({ currentFreq, targetFreq, deltaCents, isSilent, t, warningRange, perfectRange, accentColor }: Props) {
    // Calculate position for the visual marker (-1 to 1 range, capped at warningRange)
    const normalizedDelta = Math.max(-1, Math.min(1, deltaCents / warningRange));
    // Map -1..1 to 0..100%
    const markerPosition = (normalizedDelta + 1) * 50;

    // Calculate percentage-based widths for the zones
    const perfectWidth = (perfectRange / warningRange) * 50;

    return (
        <div className={`freq-readout-v2 ${isSilent ? 'freq-readout-v2--stale' : ''}`}>
            <div className="freq-readout-v2__grid">
                <div className="freq-readout-v2__row">
                    <span className="freq-readout-v2__label">{t.hearing}</span>
                    <span className="freq-readout-v2__value">{currentFreq.toFixed(1)}</span>
                    <span className="freq-readout-v2__unit">Hz</span>
                </div>
                <div className="freq-readout-v2__row" style={{ opacity: 0.6, fontSize: '0.85em' }}>
                    <span className="freq-readout-v2__label">{t.target}</span>
                    <span className="freq-readout-v2__value">{targetFreq.toFixed(1)}</span>
                    <span className="freq-readout-v2__unit">Hz</span>
                </div>
            </div>

            <div className="freq-readout-v2__bar-wrap">
                <div className="freq-readout-v2__bar">
                    {/* Low Zone */}
                    <div className="freq-readout-v2__zone freq-readout-v2__zone--low" style={{ width: `${50 - perfectWidth}%` }} />
                    {/* Perfect Zone */}
                    <div
                        className="freq-readout-v2__zone freq-readout-v2__zone--perfect"
                        style={{ width: `${perfectWidth * 2}%`, backgroundColor: accentColor }}
                    />
                    {/* High Zone */}
                    <div className="freq-readout-v2__zone freq-readout-v2__zone--high" style={{ width: `${50 - perfectWidth}%` }} />

                    <div
                        className="freq-readout-v2__marker"
                        style={{ left: `${markerPosition}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
