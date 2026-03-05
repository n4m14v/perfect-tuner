import { useTuner } from './hooks/useTuner';
import { PERFECT_RANGE_CENTS, WARNING_RANGE_CENTS } from './constants/tuner';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { StringGrid } from './components/StringGrid';
import { TunerGauge } from './components/TunerGauge';
import { InlineInstrumentPicker } from './components/InlineInstrumentPicker';
import { FreqReadout } from './components/FreqReadout';
import { Mic, MicOff } from 'lucide-react';

export function App() {
    const {
        lang,
        t,
        instrument,
        activeIdx,
        handleInstrumentChange,
        autoMode,
        toggleAuto,
        selectString,
        isListening,
        error,
        start,
        stop,
        delta,
        isSilent,
        lastDelta,
        lastTargetFreq,
        status,
    } = useTuner();

    // Compute a dynamic glow color based on status
    const getAppStyle = () => {
        if (!isListening || isSilent || status === 'idle') return undefined; // Let CSS handle base
        let glowColor = instrument.color; // Defaults to accent
        if (status === 'low' || status === 'way_low') glowColor = 'var(--clr-low)';
        if (status === 'high' || status === 'way_high') glowColor = 'var(--clr-high)';
        if (status === 'perfect') glowColor = 'var(--clr-perfect)';

        return {
            '--accent': instrument.color,
            'boxShadow': status === 'perfect' ? `inset 0 0 150px ${glowColor}1A` : undefined
        } as React.CSSProperties;
    };

    return (
        <div className="app" style={getAppStyle()}>
            {error === 'mic_denied' && (
                <div className="mic-ribbon">⚠️ {t.mic_denied}</div>
            )}

            <div className="lang-fixed">
                {/* Mic Toggle Switch */}
                <label
                    className={`mic-toggle${isListening ? ' mic-toggle--on' : ''}`}
                    style={{ '--btn-color': instrument.color } as React.CSSProperties}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                    <span className="mic-toggle__icon">{isListening ? <Mic size={18} /> : <MicOff size={18} />}</span>
                    <input
                        type="checkbox"
                        className="mic-toggle__input"
                        checked={isListening}
                        onChange={() => isListening ? stop() : start()}
                    />
                    <div className="mic-toggle__track">
                        <div className="mic-toggle__thumb"></div>
                    </div>
                </label>
                <LanguageSwitcher />
            </div>

            <header className="header">
                <h1 className="logo" style={{ color: instrument.color }}>
                    <span className="logo-word">{t.app_title}</span>
                    <span style={{ opacity: 0.3, padding: '0 8px' }}>{t.title_separator}</span>
                    <InlineInstrumentPicker
                        instrument={instrument}
                        lang={lang}
                        onChange={handleInstrumentChange}
                    />
                </h1>
            </header>

            <div className="tuner-core" style={{ borderTopColor: instrument.color }}>
                <StringGrid
                    strings={instrument.strings}
                    activeIdx={activeIdx}
                    onSelect={selectString}
                    accentColor={instrument.color}
                    autoMode={autoMode}
                    onToggleAuto={toggleAuto}
                    autoLabel={t.auto_detect}
                />

                <div className="gauge-area">
                    <TunerGauge
                        delta={isSilent ? lastDelta : delta}
                        isPerfect={status === 'perfect'}
                        accentColor={instrument.color}
                        status={status}
                        labelTighten={t.gauge_tighten}
                        labelPerfect={t.gauge_perfect}
                        labelLoosen={t.gauge_loosen}
                        perfectRange={PERFECT_RANGE_CENTS}
                        warningRange={WARNING_RANGE_CENTS}
                        isSilent={isSilent}
                    />

                    <FreqReadout
                        hearingHz={lastDelta !== null && lastTargetFreq !== null ? lastTargetFreq * Math.pow(2, lastDelta / 1200) : 0}
                        targetHz={lastTargetFreq ?? (activeIdx !== null ? instrument.strings[activeIdx].freq : instrument.strings[0].freq)}
                        cents={lastDelta ?? 0}
                        isSilent={isSilent || lastTargetFreq === null}
                        t={t}
                        perfectRange={PERFECT_RANGE_CENTS}
                    />

                </div>
            </div>

            <footer className="footer">{t.footer}</footer>
        </div>
    );
}
