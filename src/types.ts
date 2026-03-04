export type Lang = 'en' | 'he' | 'ru';

export interface StringConfig {
    note: string;
    octave: number;
    freq: number;
    label: Record<Lang, string>;
}

export interface Instrument {
    id: string;
    label: Record<Lang, string>;
    icon: string;
    color: string;
    strings: StringConfig[];
}

export type TunerStatus = 'idle' | 'silent' | 'perfect' | 'low' | 'way_low' | 'high' | 'way_high';
