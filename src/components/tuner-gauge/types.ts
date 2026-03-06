import type { TunerStatus } from '../../types';

export interface TunerGaugeProps {
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
    autoMode: boolean;
    onToggleAuto: (value: boolean) => void;
}

export interface GaugeBandOpacities {
    low: number;
    perfect: number;
    high: number;
}
