import {
    GAUGE_CENTER_X,
    GAUGE_CENTER_Y,
} from './constants';

export function mapNeedleAngle(delta: number, perfectCents: number, warningCents: number): number {
    const absDelta = Math.abs(delta);
    const sign = Math.sign(delta);

    if (absDelta <= perfectCents) {
        return sign * (absDelta / perfectCents) * 15;
    }

    const progression = Math.min(1, (absDelta - perfectCents) / Math.max(1, warningCents - perfectCents));
    return sign * (15 + progression * 65);
}

export function getGaugePoint(angleDeg: number, radius: number) {
    const radians = (angleDeg - 90) * (Math.PI / 180);

    return {
        x: GAUGE_CENTER_X + radius * Math.cos(radians),
        y: GAUGE_CENTER_Y + radius * Math.sin(radians),
    };
}

export function getSectorLine(startDeg: number, endDeg: number, radius: number): string {
    const startPoint = getGaugePoint(startDeg, radius);
    const endPoint = getGaugePoint(endDeg, radius);
    const largeArcFlag = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;

    return `M ${startPoint.x.toFixed(2)} ${startPoint.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endPoint.x.toFixed(2)} ${endPoint.y.toFixed(2)}`;
}
