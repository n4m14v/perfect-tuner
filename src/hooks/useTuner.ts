import { useState, useCallback, useEffect, useRef } from 'react';
import { INSTRUMENTS } from '../config/instruments';
import { useLang } from '../context/LangContext';
import { useTranslations } from '../config/translations';
import { usePitchDetection } from './usePitchDetection';
import { foldToTarget, applyAccent } from '../utils/pitchUtils';
import { PERFECT_RANGE, PERFECT_EXIT, WARNING_RANGE } from '../constants/tuner';
import type { Instrument, TunerStatus } from '../types';

export function useTuner() {
    const { lang } = useLang();
    const t = useTranslations(lang);

    const [instrument, setInstrument] = useState<Instrument>(INSTRUMENTS[0]);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [autoMode, setAutoMode] = useState(true);
    const [targetFreq, setTargetFreq] = useState<number | null>(null);
    const [delta, setDelta] = useState<number | null>(null);
    const [isSilent, setIsSilent] = useState(true);
    const [lastDelta, setLastDelta] = useState<number | null>(null);
    const [lastTargetFreq, setLastTargetFreq] = useState<number | null>(null);

    // Hysteresis: track perfect-zone state in a ref so the pitch callback
    // always sees the current value without stale-closure issues.
    const inPerfectRef = useRef(false);
    const [isPerfect, setIsPerfect] = useState(false);

    const handlePitch = useCallback((rawPitch: number) => {
        let target: number | null = null;
        if (autoMode) {
            let bestIdx = 0;
            let bestDist = Infinity;
            instrument.strings.forEach((s, i) => {
                const folded = foldToTarget(rawPitch, s.freq);
                const dist = Math.abs(folded - s.freq);
                if (dist < bestDist) { bestDist = dist; bestIdx = i; }
            });
            target = instrument.strings[bestIdx].freq;
            setActiveIdx(bestIdx);
            setTargetFreq(target);
        } else {
            target = targetFreq;
        }
        if (!target) return;

        const folded = foldToTarget(rawPitch, target);
        const d = folded - target;
        const abs = Math.abs(d);

        // Hysteresis: enter perfect at PERFECT_RANGE, exit only at PERFECT_EXIT
        if (abs <= PERFECT_RANGE && !inPerfectRef.current) {
            inPerfectRef.current = true;
            setIsPerfect(true);
        } else if (abs > PERFECT_EXIT && inPerfectRef.current) {
            inPerfectRef.current = false;
            setIsPerfect(false);
        }

        setDelta(d);
        setLastDelta(d);
        setLastTargetFreq(target);
        setIsSilent(false);
    }, [autoMode, instrument.strings, targetFreq]);

    const handleSilence = useCallback(() => {
        setIsSilent(true);
        setDelta(null);
        // Reset perfect state on silence so re-entry requires re-entering the tight zone
        inPerfectRef.current = false;
        setIsPerfect(false);
    }, []);

    const { isListening, error, start, stop } = usePitchDetection({
        onPitch: handlePitch,
        onSilence: handleSilence,
    });

    // Apply initial accent colour and start listening on mount
    useEffect(() => {
        applyAccent(INSTRUMENTS[0].color);
        start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInstrumentChange = useCallback((inst: Instrument) => {
        setInstrument(inst);
        setActiveIdx(null);
        setTargetFreq(null);
        setDelta(null);
        setLastDelta(null);
        setLastTargetFreq(null);
        setIsSilent(true);
        inPerfectRef.current = false;
        setIsPerfect(false);
        applyAccent(inst.color);
        if (!autoMode) stop();
    }, [autoMode, stop]);

    const selectString = useCallback(async (idx: number) => {
        setAutoMode(false);
        setActiveIdx(idx);
        setTargetFreq(instrument.strings[idx].freq);
        setDelta(null);
        setIsSilent(true);
        await start();
    }, [instrument.strings, start]);

    const toggleAuto = useCallback(async (on: boolean) => {
        setAutoMode(on);
        if (on) {
            setActiveIdx(null);
            setTargetFreq(null);
            setDelta(null);
            setIsSilent(true);
            await start();
        }
    }, [start]);

    // Derived status — uses isPerfect (hysteresis) instead of raw delta comparison
    const status: TunerStatus = !isListening
        ? 'idle'
        : isSilent
            ? 'silent'
            : isPerfect
                ? 'perfect'
                : (delta !== null && delta < 0)
                    ? (Math.abs(delta) > WARNING_RANGE ? 'way_low' : 'low')
                    : (delta !== null && delta > 0)
                        ? (Math.abs(delta) > WARNING_RANGE ? 'way_high' : 'high')
                        : 'silent';

    return {
        // i18n
        lang,
        t,
        // instrument
        instrument,
        activeIdx,
        handleInstrumentChange,
        // mode
        autoMode,
        toggleAuto,
        selectString,
        // listening
        isListening,
        error,
        start,
        stop,
        // pitch state
        delta,
        isSilent,
        lastDelta,
        lastTargetFreq,
        isPerfect,
        status,
    };
}
