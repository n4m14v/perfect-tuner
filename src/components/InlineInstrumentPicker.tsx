import { useState, useRef, useEffect } from 'react';
import { INSTRUMENTS } from '../config/instruments';
import type { Instrument } from '../types';
import type { Lang } from '../types';

interface Props {
    instrument: Instrument;
    lang: Lang;
    onChange: (inst: Instrument) => void;
}

export function InlineInstrumentPicker({ instrument, lang, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        function handleOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [open]);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false);
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open]);

    return (
        <span className="logo-picker" ref={ref}>
            <button
                className={`logo-picker-btn${open ? ' logo-picker-btn--open' : ''}`}
                onClick={() => setOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label="Select instrument"
            >
                {instrument.label[lang]}
                <span className="logo-picker-caret" aria-hidden="true">▾</span>
            </button>

            {open && (
                <ul className="logo-picker-dropdown" role="listbox">
                    {INSTRUMENTS.map(inst => (
                        <li
                            key={inst.id}
                            role="option"
                            aria-selected={inst.id === instrument.id}
                            className={`logo-picker-option${inst.id === instrument.id ? ' logo-picker-option--active' : ''}`}
                            onClick={() => { onChange(inst); setOpen(false); }}
                            onKeyDown={e => { if (e.key === 'Enter') { onChange(inst); setOpen(false); } }}
                            tabIndex={0}
                        >
                            {inst.label[lang]}
                        </li>
                    ))}
                </ul>
            )}
        </span>
    );
}
