import type { Translations } from '../config/translations';

interface Props {
    t: Translations;
}

export function HowToLegend({ t }: Props) {
    return (
        <div className="how-to">
            <div className="tip tip-low">
                <span className="tip-icon">⬆️</span>
                {t.tip_low.split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 ? <br /> : null}</span>
                ))}
            </div>
            <div className="tip tip-ok">
                <span className="tip-icon">✅</span>
                {t.tip_ok.split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 ? <br /> : null}</span>
                ))}
            </div>
            <div className="tip tip-high">
                <span className="tip-icon">⬇️</span>
                {t.tip_high.split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 ? <br /> : null}</span>
                ))}
            </div>
        </div>
    );
}
