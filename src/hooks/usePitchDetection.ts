import { useRef, useState, useCallback, useEffect } from 'react';
import { PitchDetector } from 'pitchy';
import { getCentsDiff } from '../utils/pitchMath';

const SMOOTH_ALPHA = 0.08;
const RMS_THRESHOLD = 0.01;
const CLARITY_THRESHOLD = 0.9;
const FFT_SIZE = 4096; // handles cello C2 (65 Hz) without issue

interface UsePitchDetectionOptions {
    onPitch: (pitch: number) => void;
    onSilence: () => void;
}

export function usePitchDetection({ onPitch, onSilence }: UsePitchDetectionOptions) {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const rafRef = useRef<number | null>(null);
    const smoothedRef = useRef<number | null>(null);
    const detectorRef = useRef<PitchDetector<Float32Array> | null>(null);
    const maxRmsRef = useRef<number>(0);
    const lastValidPitchRef = useRef<number | null>(null);

    // Stable refs for callbacks — avoids stale closures in the RAF loop
    const onPitchRef = useRef(onPitch);
    const onSilenceRef = useRef(onSilence);
    useEffect(() => { onPitchRef.current = onPitch; }, [onPitch]);
    useEffect(() => { onSilenceRef.current = onSilence; }, [onSilence]);

    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyse = useCallback(() => {
        if (!analyserRef.current || !audioCtxRef.current || !detectorRef.current) return;
        rafRef.current = requestAnimationFrame(analyse);

        const analyser = analyserRef.current;
        const buf = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buf);

        // RMS silence gate
        let rms = 0;
        for (const v of buf) rms += v * v;
        rms = Math.sqrt(rms / buf.length);

        if (rms < RMS_THRESHOLD) {
            smoothedRef.current = null;
            maxRmsRef.current = 0;
            lastValidPitchRef.current = null;
            onSilenceRef.current();
            return;
        }

        // Track peak RMS for the current note session
        if (rms > maxRmsRef.current) maxRmsRef.current = rms;

        const [pitch, clarity] = detectorRef.current.findPitch(buf, audioCtxRef.current.sampleRate);

        // Basic quality gate
        if (clarity < CLARITY_THRESHOLD || pitch < 20) return;

        // Peak Hold / Transient Filter:
        // If we are in the decay phase (RMS falling significantly from peak),
        // and current pitch is suspicious (different from last sustained), ignore it.
        const isDecaying = rms < maxRmsRef.current * 0.6;
        if (isDecaying && lastValidPitchRef.current !== null) {
            const diffCents = Math.abs(getCentsDiff(pitch, lastValidPitchRef.current));
            // If pitch starts jumping around during decay, ignore and hold last valid
            if (diffCents > 50) return;
        }

        // Asymmetric Smoothing:
        // Respond faster to pitch changes when clarity is high and RMS is strong.
        // Respond slower when "falling away" from a sustained pitch.
        const prev = smoothedRef.current;
        let alpha = SMOOTH_ALPHA;

        if (prev !== null) {
            const isClimbing = rms >= maxRmsRef.current * 0.8;
            if (isClimbing) {
                alpha = 0.2; // Fast attack to catch the note
            } else if (isDecaying) {
                alpha = 0.02; // Very slow decay to hold the "high part"
            }
        }

        smoothedRef.current = prev === null ? pitch : alpha * pitch + (1 - alpha) * prev;

        // Update sustain anchor if we have good clarity and volume
        if (clarity > 0.95 && rms > maxRmsRef.current * 0.5) {
            lastValidPitchRef.current = smoothedRef.current;
        }

        onPitchRef.current(smoothedRef.current);
    }, []);

    const start = useCallback(async () => {
        if (audioCtxRef.current) {
            if (audioCtxRef.current.state === 'suspended') await audioCtxRef.current.resume();
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            streamRef.current = stream;

            const ctx = new AudioContext();
            audioCtxRef.current = ctx;

            const analyser = ctx.createAnalyser();
            analyser.fftSize = FFT_SIZE;
            analyser.smoothingTimeConstant = 0.3;
            analyserRef.current = analyser;

            detectorRef.current = PitchDetector.forFloat32Array(FFT_SIZE);

            const source = ctx.createMediaStreamSource(stream);
            source.connect(analyser);
            sourceRef.current = source;

            smoothedRef.current = null;
            maxRmsRef.current = 0;
            lastValidPitchRef.current = null;
            setIsListening(true);
            setError(null);

            if (!rafRef.current) rafRef.current = requestAnimationFrame(analyse);
        } catch {
            setError('mic_denied');
        }
    }, [analyse]);

    const stop = useCallback(() => {
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        sourceRef.current?.disconnect();
        sourceRef.current = null;
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        audioCtxRef.current?.close();
        audioCtxRef.current = null;
        analyserRef.current = null;
        detectorRef.current = null;
        smoothedRef.current = null;
        maxRmsRef.current = 0;
        lastValidPitchRef.current = null;
        setIsListening(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => () => stop(), [stop]);

    return { isListening, error, start, stop };
}
