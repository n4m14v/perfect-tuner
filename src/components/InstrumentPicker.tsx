import type { Instrument } from '../types';
import { useLang } from '../context/LangContext';

interface Props {
    instruments: Instrument[];
    activeId: string;
    onSelect: (inst: Instrument) => void;
}

export function InstrumentPicker({ instruments, activeId, onSelect }: Props) {
    const { lang } = useLang();

    return (
        <div className="instrument-picker" role="tablist" aria-label="Instrument">
            <div className="picker-row">
                {instruments.map((inst) => (
                    <button
                        key={inst.id}
                        role="tab"
                        aria-selected={inst.id === activeId}
                        className={`inst-card${inst.id === activeId ? ' active' : ''}`}
                        onClick={() => onSelect(inst)}
                    >
                        <span className="inst-icon">{inst.icon}</span>
                        <span className="inst-name">{inst.label[lang]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
