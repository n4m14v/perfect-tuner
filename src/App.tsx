import { useState } from 'react';
import { useTuner } from './hooks/useTuner';
import { PERFECT_RANGE_CENTS, WARNING_RANGE_CENTS } from './constants/tuner';
import { getDetectedFrequency } from './utils/pitchMath';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { StringGrid } from './components/StringGrid';
import { TunerGauge } from './components/TunerGauge';
import { InlineInstrumentPicker } from './components/InlineInstrumentPicker';
import { FreqReadout } from './components/FreqReadout';
import { Mic, MicOff, Info, AlertOctagon, Menu } from 'lucide-react';
import { InfoModal } from './components/InfoModal';
import './Tuner.css';

export function App() {
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    return (
        <div className="aero-mobile-container">
            {error === 'mic_denied' && (
                <div className="mic-ribbon" role="alert">
                    <AlertOctagon size={16} strokeWidth={2.5} />
                    <span>{t.mic_denied}</span>
                </div>
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
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} />
                    </button>
                    <div className={`header-actions-container ${isMobileMenuOpen ? 'open' : ''}`}>
                        {/* Mic toggle */}
                        <button
                            className={`mic-icon-btn ${!isListening ? 'mic-off' : ''}`}
                            style={{ color: isListening ? instrument.color : 'var(--clr-text-muted)' } as React.CSSProperties}
                            aria-label={isListening ? 'Stop listening' : 'Start listening'}
                            onClick={() => {
                                isListening ? stop() : start();
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                        </button>
                        <button
                            className="info-icon-btn"
                            onClick={() => {
                                setIsInfoOpen(true);
                                setIsMobileMenuOpen(false);
                            }}
                            aria-label="How to use"
                            style={{ marginLeft: '12px' }}
                        >
                            <Info size={20} />
                        </button>
                        <div style={{ marginLeft: '12px' }}>
                            <LanguageSwitcher />
                        </div>
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
                        hearingHz={lastDelta !== null && lastTargetFreq !== null ? getDetectedFrequency(lastTargetFreq, lastDelta) : 0}
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
