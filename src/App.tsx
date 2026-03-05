import { useState } from 'react';
import { useTuner } from './hooks/useTuner';
import { PERFECT_RANGE_CENTS, WARNING_RANGE_CENTS } from './constants/tuner';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { StringGrid } from './components/StringGrid';
import { TunerGauge } from './components/TunerGauge';
import { InlineInstrumentPicker } from './components/InlineInstrumentPicker';
import { FreqReadout } from './components/FreqReadout';
import { Mic, MicOff, Info } from 'lucide-react';
import { InfoModal } from './components/InfoModal';
import './Tuner.css';

export function App() {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
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

    // Compute a dynamic glow color and radius based on status
    const getAppStyle = () => {
        let glowColor = instrument.color; // Defaults to accent
        let glowRadius = '20%'; // Default when far or not listening

        if (isListening && !isSilent && status !== 'idle') {
            if (status === 'low' || status === 'way_low') glowColor = 'var(--clr-low)';
            if (status === 'high' || status === 'way_high') glowColor = 'var(--clr-high)';
            if (status === 'perfect') glowColor = 'var(--clr-perfect)';

            if (delta !== null) {
                const absDelta = Math.min(Math.abs(delta), 30);
                // When 0 cents -> 60%, when 30 cents -> 20%.
                const scaled = 60 - (absDelta / 30) * 40;
                glowRadius = `${scaled}%`;
            }
        }

        return {
            '--accent': instrument.color,
            '--glow-base': glowColor,
            '--glow-radius': glowRadius,
        } as React.CSSProperties;
    };

    return (
        <div className="aero-mobile-container" style={getAppStyle()}>
            {error === 'mic_denied' && (
                <div className="mic-ribbon">⚠️ {t.mic_denied}</div>
            )}

            <header className="aero-header" dir="ltr">
                <div className="aero-header-left">
                    <h1 className="aero-header-title" style={{ color: instrument.color }}>
                        <span className="logo-word">{t.app_title}</span>
                        <span className="logo-word" style={{ opacity: 0.3, padding: '0 8px' }}>{t.title_separator}</span>
                        <InlineInstrumentPicker
                            instrument={instrument}
                            lang={lang}
                            onChange={handleInstrumentChange}
                        />
                    </h1>
                </div>
                <div className="aero-header-right">
                    {/* Mic toggle */}
                    <button
                        className={`mic-icon-btn ${!isListening ? 'mic-off' : ''}`}
                        style={{ color: isListening ? instrument.color : 'var(--clr-text-muted)' } as React.CSSProperties}
                        aria-label={isListening ? 'Stop listening' : 'Start listening'}
                        onClick={() => isListening ? stop() : start()}
                    >
                        {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                    </button>
                    <button
                        className="info-icon-btn"
                        onClick={() => setIsInfoOpen(true)}
                        aria-label="How to use"
                        style={{ marginLeft: '12px' }}
                    >
                        <Info size={20} />
                    </button>
                    <div style={{ marginLeft: '12px' }}>
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            <main className="aero-stage">
                <div className="aero-gauge-wrapper">
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
                        autoMode={autoMode}
                        onToggleAuto={toggleAuto}
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
            </main>

            <footer className="aero-control-dock">
                <StringGrid
                    strings={instrument.strings}
                    activeIdx={activeIdx}
                    onSelect={selectString}
                    accentColor={instrument.color}
                />

                {/* Footer text could be embedded or positioned absolute at bottom */}
                <div style={{ opacity: 0.3, fontSize: '0.65rem', marginTop: '16px', fontFamily: 'var(--font-mono)' }}>
                    {t.footer}
                </div>
            </footer>

            <InfoModal
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                t={t}
                accentColor={instrument.color}
            />
        </div>
    );
}
