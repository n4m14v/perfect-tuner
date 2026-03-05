import type { StringConfig } from '../types';
import { useLang } from '../context/LangContext';

interface Props {
    strings: StringConfig[];
    activeIdx: number | null;
    onSelect: (idx: number) => void;
    accentColor: string;
    autoMode: boolean;
    onToggleAuto: (val: boolean) => void;
    autoText: string;
}

function gridCols(n: number): number {
    if (n <= 4) return n;
    if (n === 5) return 3; // 4 strings + auto = 5 -> 3 columns 
    return 3;
}

export function StringGrid({ strings, activeIdx, onSelect, accentColor, autoMode, onToggleAuto, autoText }: Props) {
    const { lang } = useLang();
    const cols = gridCols(strings.length + 1);

    return (
        <div className="string-grid-wrap">
            <div className="string-grid-main">
                <div
                    className="string-grid"
                    style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                    dir="ltr"
                >
                    <button
                        className={`string-btn${autoMode ? ' active' : ''}`}
                        style={{ '--btn-color': accentColor } as React.CSSProperties}
                        onClick={() => onToggleAuto(!autoMode)}
                        aria-pressed={autoMode}
                        aria-label={autoText}
                    >
                        <span className="string-note" style={{ fontSize: '1.2rem', padding: '6px 0' }}>
                            AUTO
                        </span>
                        <span className="string-label">{autoText}</span>
                        <span className="string-freq">DETECT</span>
                    </button>
                    {strings.map((s, i) => (
                        <button
                            key={`${s.note}${s.octave}-${i}`}
                            className={`string-btn${activeIdx === i ? ' active' : ''}`}
                            style={{ '--btn-color': accentColor } as React.CSSProperties}
                            onClick={() => onSelect(i)}
                            aria-label={`${s.note}${s.octave} — ${s.label[lang]}`}
                            aria-pressed={activeIdx === i}
                        >
                            <span className="string-note">
                                {s.note}
                                <sup className="string-octave">{s.octave}</sup>
                            </span>
                            <span className="string-label">{s.label[lang]}</span>
                            <span className="string-freq">{s.freq.toFixed(2)} Hz</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
