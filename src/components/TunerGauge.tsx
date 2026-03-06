import { GaugeArc } from './tuner-gauge/GaugeArc';
import { GaugeCenterHub } from './tuner-gauge/GaugeCenterHub';
import { GaugeDefs } from './tuner-gauge/GaugeDefs';
import { GaugeLabels } from './tuner-gauge/GaugeLabels';
import { GaugeNeedle } from './tuner-gauge/GaugeNeedle';
import {
    GAUGE_INNER_RADIUS,
    GAUGE_OUTER_RADIUS,
} from './tuner-gauge/constants';
import { getGaugeBandOpacities } from './tuner-gauge/getGaugeBandOpacities';
import { getGaugePoint, getSectorLine, mapNeedleAngle } from './tuner-gauge/geometry';
import type { TunerGaugeProps } from './tuner-gauge/types';

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
    autoMode,
    onToggleAuto,
}: TunerGaugeProps) {
    const needleAngle = delta !== null ? mapNeedleAngle(delta, perfectRange, warningRange) : 0;
    const hasSignal = status !== 'idle' && status !== 'silent';
    const bandOpacities = getGaugeBandOpacities(status, isPerfect, isSilent);
    const trackColor = 'rgba(255,255,255,0.05)';

    return (
        <div className="gauge-wrap">
            <svg viewBox="0 0 300 180" className="gauge-svg" aria-hidden="true">
                <GaugeDefs bandOpacities={bandOpacities} />

                <path d={getSectorLine(-80, 80, GAUGE_INNER_RADIUS)} fill="none" stroke={trackColor} strokeWidth="2" strokeLinecap="round" />

                <GaugeArc accentColor={accentColor} hasSignal={hasSignal} />

                <g>
                    {[-10, 10].map(angle => {
                        const innerPoint = getGaugePoint(angle, GAUGE_OUTER_RADIUS - 5);
                        const outerPoint = getGaugePoint(angle, GAUGE_OUTER_RADIUS + 5);
                        return (
                            <line
                                key={angle}
                                x1={innerPoint.x.toFixed(2)} y1={innerPoint.y.toFixed(2)}
                                x2={outerPoint.x.toFixed(2)} y2={outerPoint.y.toFixed(2)}
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        );
                    })}
                </g>

                <GaugeNeedle
                    angle={needleAngle}
                    accentColor={accentColor}
                    hasSignal={hasSignal}
                    isPerfect={isPerfect}
                    isSilent={isSilent}
                />
                <GaugeCenterHub autoMode={autoMode} onToggleAuto={onToggleAuto} />
                <GaugeLabels
                    accentColor={accentColor}
                    bandOpacities={bandOpacities}
                    labelLoosen={labelLoosen}
                    labelPerfect={labelPerfect}
                    labelTighten={labelTighten}
                />
            </svg>
        </div>
    );
}
