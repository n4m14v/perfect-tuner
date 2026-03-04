import type { TunerStatus, StringConfig } from '../types';
import type { Translations } from '../config/translations';
import { useRef, useEffect } from 'react';

interface Props {
    status: TunerStatus;
    t: Translations;
    activeString: StringConfig | null;
    delta: number | null;
}

const STATUS_ICON: Record<TunerStatus, string> = {
    idle: '🎵',
    silent: '🎵',
    perfect: '✅',
    low: '⬆️',
    way_low: '⬆️',
    high: '⬇️',
    way_high: '⬇️',
};

const STATUS_COLOR: Record<TunerStatus, string> = {
    idle: 'var(--clr-neutral)',
    silent: 'var(--clr-neutral)',
    perfect: 'var(--clr-perfect)',
    low: 'var(--clr-low)',
    way_low: 'var(--clr-low)',
    high: 'var(--clr-high)',
    way_high: 'var(--clr-high)',
};

export function StatusDisplay({ status, t, activeString, delta: _delta }: Props) {
    const iconRef = useRef<HTMLDivElement>(null);
    const prevStatus = useRef<TunerStatus>('idle');

    useEffect(() => {
        if (iconRef.current && prevStatus.current !== status) {
            iconRef.current.classList.remove('pop');
            void iconRef.current.offsetWidth; // reflow
            iconRef.current.classList.add('pop');
            prevStatus.current = status;
        }
    }, [status]);

    const noteName = activeString ? `${activeString.note}${activeString.octave}` : '';

    const textMap: Record<TunerStatus, string> = {
        idle: t.pick_string,
        silent: activeString ? t.play_string(noteName) : t.pick_string,
        perfect: t.perfect,
        low: t.too_low,
        way_low: t.way_too_low,
        high: t.too_high,
        way_high: t.way_too_high,
    };

    const subMap: Record<TunerStatus, string> = {
        idle: 'Tap a string button above',
        silent: t.hold_steady,
        perfect: t.in_tune,
        low: t.tighten,
        way_low: t.tighten,
        high: t.loosen,
        way_high: t.loosen,
    };

    return (
        <div className="status-display">
            <div ref={iconRef} className="status-icon">{STATUS_ICON[status]}</div>
            <div className="status-text" style={{ color: STATUS_COLOR[status] }}>
                {textMap[status]}
            </div>
            <div className="status-sub">{subMap[status]}</div>
        </div>
    );
}
