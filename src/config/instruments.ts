import type { Instrument } from '../types';

export const INSTRUMENTS: Instrument[] = [
    {
        id: 'cello',
        label: { en: 'Cello', he: 'צ\'לו', ru: 'Виолончель' },
        icon: '🎻',
        color: '#a29bfe',
        strings: [
            { note: 'C', octave: 2, freq: 65.41, label: { en: '4th string', he: 'מיתר 4', ru: '4-я струна' } },
            { note: 'G', octave: 2, freq: 98.00, label: { en: '3rd string', he: 'מיתר 3', ru: '3-я струна' } },
            { note: 'D', octave: 3, freq: 146.83, label: { en: '2nd string', he: 'מיתר 2', ru: '2-я струна' } },
            { note: 'A', octave: 3, freq: 220.00, label: { en: '1st string', he: 'מיתר 1', ru: '1-я струна' } },
        ],
    },
    {
        id: 'violin',
        label: { en: 'Violin', he: 'כינור', ru: 'Скрипка' },
        icon: '🎻',
        color: '#ff9f43',
        strings: [
            { note: 'G', octave: 3, freq: 196.00, label: { en: '4th string', he: 'מיתר 4', ru: '4-я струна' } },
            { note: 'D', octave: 4, freq: 293.66, label: { en: '3rd string', he: 'מיתר 3', ru: '3-я струна' } },
            { note: 'A', octave: 4, freq: 440.00, label: { en: '2nd string', he: 'מיתר 2', ru: '2-я струна' } },
            { note: 'E', octave: 5, freq: 659.25, label: { en: '1st string', he: 'מיתר 1', ru: '1-я струна' } },
        ],
    },
    {
        id: 'guitar',
        label: { en: 'Guitar', he: 'גיטרה', ru: 'Гитара' },
        icon: '🎸',
        color: '#00b894',
        strings: [
            { note: 'E', octave: 2, freq: 82.41, label: { en: '6th string', he: 'מיתר 6', ru: '6-я струна' } },
            { note: 'A', octave: 2, freq: 110.00, label: { en: '5th string', he: 'מיתר 5', ru: '5-я струна' } },
            { note: 'D', octave: 3, freq: 146.83, label: { en: '4th string', he: 'מיתר 4', ru: '4-я струна' } },
            { note: 'G', octave: 3, freq: 196.00, label: { en: '3rd string', he: 'מיתר 3', ru: '3-я струна' } },
            { note: 'B', octave: 3, freq: 246.94, label: { en: '2nd string', he: 'מיתר 2', ru: '2-я струна' } },
            { note: 'E', octave: 4, freq: 329.63, label: { en: '1st string', he: 'מיתר 1', ru: '1-я струна' } },
        ],
    },
    {
        id: 'ukulele',
        label: { en: 'Ukulele', he: 'אוקולילה', ru: 'Укулеле' },
        icon: '🪕',
        color: '#fd79a8',
        strings: [
            { note: 'G', octave: 4, freq: 392.00, label: { en: '4th string', he: 'מיתר 4', ru: '4-я струна' } },
            { note: 'C', octave: 4, freq: 261.63, label: { en: '3rd string', he: 'מיתר 3', ru: '3-я струна' } },
            { note: 'E', octave: 4, freq: 329.63, label: { en: '2nd string', he: 'מיתר 2', ru: '2-я струна' } },
            { note: 'A', octave: 4, freq: 440.00, label: { en: '1st string', he: 'מיתר 1', ru: '1-я струна' } },
        ],
    },
];
