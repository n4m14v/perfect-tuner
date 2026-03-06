export function foldToTarget(freq: number, target: number): number {
    let foldedFreq = freq;

    while (foldedFreq < target * 0.7) foldedFreq *= 2;
    while (foldedFreq > target * 1.4) foldedFreq /= 2;

    return foldedFreq;
}

export function getCentsDiff(freq: number, target: number): number {
    return 1200 * Math.log2(freq / target);
}

export function getDetectedFrequency(targetHz: number, cents: number): number {
    return targetHz * Math.pow(2, cents / 1200);
}
