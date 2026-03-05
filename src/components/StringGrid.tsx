import type { StringConfig } from '../types';
import { useLang } from '../context/LangContext';

interface Props {
    strings: StringConfig[];
    activeIdx: number | null;
    onSelect: (idx: number) => void;
    accentColor: string;
    autoMode: boolean;
    onToggleAuto: (on: boolean) => void;
    autoLabel: string;
}

function gridCols(n: number): number {
    if (n <= 4) return n;
    return 3; // 5 or 6 strings → 3 columns (2 rows)
}

export function StringGrid({ strings, activeIdx, onSelect, accentColor, autoMode, onToggleAuto, autoLabel }: Props) {
    const { lang } = useLang();
    const cols = gridCols(strings.length);

    return (
        <div className="string-grid-wrap">
            <div className="string-grid-main">
                <div
                    className="string-grid"
                    style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                    dir="ltr"
                >
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

            {/* Auto-detect pill — sits beneath the string buttons */}
            <button
                className={`auto-pill${autoMode ? ' auto-pill--on' : ''}`}
                style={{ '--btn-color': accentColor } as React.CSSProperties}
                onClick={() => onToggleAuto(!autoMode)}
                aria-pressed={autoMode}
            >
                <span className="auto-pill__dot" />
                {autoLabel}
            </button>
        </div>
    );
}
