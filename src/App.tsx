import { useTuner } from './hooks/useTuner';
import { PERFECT_RANGE, WARNING_RANGE } from './constants/tuner';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { StringGrid } from './components/StringGrid';
import { TunerGauge } from './components/TunerGauge';
import { InlineInstrumentPicker } from './components/InlineInstrumentPicker';
import { FreqReadout } from './components/FreqReadout';

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

    return (
        <div className="app">
            {error === 'mic_denied' && (
                <div className="mic-ribbon">⚠️ {t.mic_denied}</div>
            )}

            <div className="lang-fixed">
                <LanguageSwitcher />
            </div>

            <header className="header">
                <h1 className="logo">
                    <span className="logo-word">{t.app_title}</span>
                    {t.title_separator}
                    <InlineInstrumentPicker
                        instrument={instrument}
                        lang={lang}
                        onChange={handleInstrumentChange}
                    />
                </h1>
            </header>

            <div className="tuner-core">
                <StringGrid
                    strings={instrument.strings}
                    activeIdx={activeIdx}
                    onSelect={selectString}
                    accentColor={instrument.color}
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
                        perfectRange={PERFECT_RANGE}
                        warningRange={WARNING_RANGE}
                        isSilent={isSilent}
                    />

                    {lastDelta !== null && lastTargetFreq !== null && (
                        <FreqReadout
                            currentFreq={lastTargetFreq + lastDelta}
                            targetFreq={lastTargetFreq}
                            isSilent={isSilent}
                            t={t}
                            warningRange={WARNING_RANGE}
                            perfectRange={PERFECT_RANGE}
                            accentColor={instrument.color}
                        />
                    )}
                </div>

                <div className="controls">
                    <div className="auto-toggle-wrap">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={autoMode}
                                onChange={e => toggleAuto(e.target.checked)}
                            />
                            <span className="toggle-track" />
                        </label>
                        <span className={`toggle-label${autoMode ? ' on' : ''}`}>
                            {t.auto_detect}: {autoMode ? t.auto_on : t.auto_off}
                        </span>
                    </div>

                    <div className="auto-toggle-wrap">
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={isListening}
                                onChange={e => {
                                    if (e.target.checked) start();
                                    else stop();
                                }}
                            />
                            <span className="toggle-track" />
                        </label>
                        <span className={`toggle-label${isListening ? ' on' : ''}`}>
                            {t.stop}: {isListening ? t.auto_on : t.auto_off}
                        </span>
                    </div>
                </div>
            </div>

            <footer className="footer">{t.footer}</footer>
        </div>
    );
}
