import type { StringConfig } from '../types';
import { useLang } from '../context/LangContext';
interface Props {
    strings: StringConfig[];
    activeIdx: number | null;
    onSelect: (idx: number) => void;
    accentColor: string;
}

export function StringGrid({ strings, activeIdx, onSelect, accentColor }: Props) {
    const { lang } = useLang();

    return (
        <div className="aero-string-grid-wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
            <div className="aero-string-grid">
                {strings.map((s, i) => (
                    <button
                        key={`${s.note}${s.octave}-${i}`}
                        className={`aero-string-btn${activeIdx === i ? ' active' : ''}`}
                        style={{ '--btn-color': accentColor } as React.CSSProperties}
                        onClick={() => onSelect(i)}
                        aria-label={`${s.note}${s.octave} — ${s.label[lang]}`}
                        aria-pressed={activeIdx === i}
                    >
                        <span className="note-name">
                            {s.note}
                            <sup className="note-octave">{s.octave}</sup>
                        </span>
                        <span className="note-freq">{s.freq.toFixed(1)}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
