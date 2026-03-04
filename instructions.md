# Perfect Tuner — Project Brief & Implementation Plan

## 1. Vision

A professional-grade, free, browser-based instrument tuner for real players. Clean, fast, works on any device. No install. Supports multiple languages and multiple instruments out of the box, with a simple config system that makes adding new instruments or languages trivial.

---

## 2. Brand

- **Name:** Perfect Tuner
- **Tagline (EN):** "Always in tune."
- **Domain direction:** `perfecttuner.app` (or similar — TBD by user)
- **Aesthetic:** Dark, professional, premium. Not childish. Subtle gradients, glass-morphism cards, smooth micro-animations.

---

## 3. Target Audience

- Amateur and intermediate string players (cello, violin, guitar, ukulele)
- Multi-lingual users: English, Hebrew (RTL), Russian
- Works on both desktop and mobile browsers (no installation required)

---

## 4. Languages (i18n)

### Supported Languages

| Code | Language | Direction |
|------|----------|-----------|
| `en` | English  | LTR |
| `he` | Hebrew   | RTL |
| `ru` | Russian  | LTR |

### How i18n Works

- A single `TRANSLATIONS` object in JS maps every user-visible string to `{ en, he, ru }`.
- A `lang` state variable tracks the active language (default: `en`, auto-detected from `navigator.language`).
- A compact language switcher (3 pill buttons in the header) switches instantly — no page reload.
- The `<html>` element gets `lang` and `dir` attributes updated on switch.
- **No external i18n library** — pure JS object lookup.

### Strings to Translate

| Key | EN | HE | RU |
|-----|----|----|----|
| `tagline` | Always in tune. | תמיד במקצב. | Всегда в строе. |
| `pick_string` | Pick a string to start | בחר מיתר להתחיל | Выберите струну |
| `play_string` | Play the {note} string! | נגן על המיתר {note}! | Играйте струну {note}! |
| `play_any` | Play any string! | נגן על כל מיתר! | Играйте любую струну! |
| `perfect` | Perfect! | מושלם! | Отлично! |
| `in_tune` | Your string is in tune 🎉 | המיתר שלך מכוון 🎉 | Ваша струна настроена 🎉 |
| `too_low` | A little low | קצת נמוך מדי | Немного занижено |
| `way_too_low` | Way too low! | נמוך מדי! | Сильно занижено! |
| `too_high` | A little high | קצת גבוה מדי | Немного завышено |
| `way_too_high` | Way too high! | גבוה מדי! | Сильно завышено! |
| `tighten` | Tighten the string slowly | הדק את המיתר לאט | Натяните струну медленно |
| `loosen` | Loosen the string slowly | שחרר את המיתר לאט | Ослабьте струну медленно |
| `auto_detect` | Auto-detect | זיהוי אוטומטי | Авто-определение |
| `auto_on` | On | פעיל | Вкл |
| `auto_off` | Off | כבוי | Выкл |
| `stop` | Stop Listening | הפסק להאזין | Остановить |
| `mic_prompt` | Allow mic access when your browser asks | אפשר גישה למיקרופון בבקשה | Разрешите доступ к микрофону |
| `mic_denied` | Mic access denied — please reload | גישה למיקרופון נדחתה — טען מחדש | Доступ к микрофону отклонён |
| `tip_low` | Too low? Tighten the peg | נמוך? הדק את הפין | Низко? Подтяните колок |
| `tip_ok` | In the green? You're in tune! | בירוק? אתה מכוון! | В зелёном? Вы в строе! |
| `tip_high` | Too high? Loosen the peg | גבוה? שחרר את הפין | Высоко? Ослабьте колок |
| `footer` | Free forever · Works in any modern browser | חינם לנצח · עובד בכל דפדפן מודרני | Бесплатно навсегда · Работает в любом браузере |

---

## 5. Instrument Configuration

### Design Principle

Every instrument is a **self-contained config object**. Adding a new instrument = adding one object to an array. No other code changes needed.

### Instrument Object Schema

```js
{
  id: 'guitar',          // unique string ID
  label: {               // display name per language
    en: 'Guitar',
    he: 'גיטרה',
    ru: 'Гитара',
  },
  icon: '🎸',            // emoji icon for the picker card
  color: '#00b894',      // accent color (hex) — used for active states, gauge needle, etc.
  strings: [             // ordered low → high (or instrument-conventional order)
    {
      note: 'E',         // note name (language-agnostic — same in all languages)
      octave: 2,         // octave number for display (E²)
      freq: 82.41,       // target frequency in Hz
      label: {           // string label per language
        en: '6th string',
        he: 'מיתר 6',
        ru: '6-я струна',
      }
    },
    // … more strings
  ]
}
```

### Initial Instruments (v1)

#### 🎻 Violin
| String | Octave | Hz |
|--------|--------|----|
| G | 3 | 196.00 |
| D | 4 | 293.66 |
| A | 4 | 440.00 |
| E | 5 | 659.25 |

#### 🎻 Cello
| String | Octave | Hz |
|--------|--------|----|
| C | 2 | 65.41 |
| G | 2 | 98.00 |
| D | 3 | 146.83 |
| A | 3 | 220.00 |

#### 🎸 Guitar (standard tuning)
| String | Octave | Hz |
|--------|--------|----|
| E | 2 | 82.41 |
| A | 2 | 110.00 |
| D | 3 | 146.83 |
| G | 3 | 196.00 |
| B | 3 | 246.94 |
| E | 4 | 329.63 |

#### 🪕 Ukulele (standard C tuning)
| String | Octave | Hz |
|--------|--------|----|
| G | 4 | 392.00 |
| C | 4 | 261.63 |
| E | 4 | 329.63 |
| A | 4 | 440.00 |

### Future Instruments (just add to the array)
Bass, Viola, Mandolin, Banjo, 12-string Guitar, Drop-D Guitar, Oud, etc.

---

## 6. UI / UX Design

### Layout (top → bottom)

```
[ Header: logo + language switcher ]
[ Instrument picker: horizontal scroll row of cards ]
[ String grid: dynamic NxM grid of string buttons ]
[ Gauge: circular needle meter ]
[ Status text: icon + message + sub-message ]
[ Frequency readout: detected Hz | target Hz ]
[ Auto-detect toggle ]
[ Stop Listening button ]
[ How-To legend: 3 tip cards ]
[ Footer ]
```

### Header
- Logo: "Perfect Tuner" with gradient text (accent color shifts per instrument)
- Tagline in the active language
- Language switcher: `EN | עב | РУ` — three pill buttons, active one is highlighted

### Instrument Picker
- Horizontal scrollable row, no visible scrollbar
- Each card: large emoji icon + localized name + bottom glow when active
- Accent color transitions smoothly on instrument change (CSS custom property update)

### String Grid
- Dynamic: rendered from the instrument's `strings` array
- Columns: `≤4 strings → 4-col single row`, `5–6 strings → 3-col 2-row`
- Each button shows: **note name** (large), octave superscript, localized string label, frequency in Hz
- Active string gets accent-color border + glow

### Gauge (replaces the bar)

Replace the current flat colored zones bar with a **semicircular gauge**:

- SVG-based, drawn in JS (no external library)
- **Arc spans 180°** (left = too low, center = perfect, right = too high)
- Three colored arc segments:
  - Left arc (blue/cool): too low
  - Center arc (green → accent): perfect zone (±1.5 Hz mapped)
  - Right arc (red/warm): too high
- **Needle**: a thin SVG line that rotates from the center-bottom pivot
  - Smooth CSS `transform: rotate()` transition (matching the current 0.45s ease-out)
  - Needle tip has a small accent-colored dot
- **Zone labels** inside the arc: "LOW" · "✓" · "HIGH"
- The perfect zone arc **pulses/glows** when the needle lands in it

### Status Display
- Large emoji icon (animated "pop" on change)
- Bold status text (color matches zone: blue/green/red)
- Sub-message line (tighten/loosen/celebrate)

### Frequency Readout
- `Hearing: 219.3 Hz  |  Target: 220.00 Hz`
- Tabular numerals, subtle, fades in when sound is detected

### Auto-Detect Toggle
- Toggle switch + label ("Auto-detect")
- When ON: no string needs to be selected — app auto-highlights the nearest string each frame
- When ON: string buttons still highlight but are not required to be tapped first

### Stop Button
- Appears only while mic is active
- Releases all audio resources and resets to idle state

### How-To Legend
- 3 tip cards at the bottom (low / perfect / high)
- All text in the active language

---

## 7. Audio Engine

### Mic Access
- `navigator.mediaDevices.getUserMedia({ audio: true })`
- On denial: show localized error banner

### AudioContext
- Created lazily on first string tap (or auto-mode toggle on)
- `AnalyserNode.fftSize` set dynamically:
  - `minFreq < 60 Hz` → `fftSize = 8192` (bass/cello)
  - `minFreq < 100 Hz` → `fftSize = 4096`
  - Otherwise → `fftSize = 2048` (guitar/violin/ukulele)

### Pitch Detection
- Autocorrelation algorithm (Yin-lite), same as current implementation
- Min/max frequency search bounds computed per-instrument from string freq range × 0.7–1.5
- Sub-sample interpolation for accuracy

### Smoothing
- Exponential moving average: `alpha = 0.08` (tuneable constant)
- Reset on silence, string switch, or instrument switch

### Silence Gate
- RMS threshold `< 0.01` → show "play a string" prompt, reset pointer to center

---

## 8. File Structure

Single `index.html` — zero dependencies, zero build step. Host anywhere:
- GitHub Pages (free)
- Netlify (free tier, custom domain)
- Vercel (free tier)

```
perfect-tuner/
  index.html       ← entire app (HTML + CSS + JS inline)
  instructions.md  ← this file
  README.md        ← short deployment guide (to be written)
```

---

## 9. Technical Notes

### RTL Support (Hebrew)
- When `lang = 'he'`, set `<html dir="rtl">`
- The gauge, instrument picker, and string grid are all symmetric — no RTL-specific layout needed
- Text alignment flips automatically via CSS `direction: inherit`
- The language switcher order reverses: `РУ | עב | EN` in RTL mode

### Accent Color System
- CSS custom property `--accent` (hex), `--accent-rgb` (r,g,b components)
- Updated by JS when instrument changes
- Used across: gauge needle, active string border, instrument card glow, logo gradient, toggle active state
- Smooth transition: `transition: color 0.3s, border-color 0.3s, background 0.3s`

### Gauge Implementation Detail
- SVG `<path>` with `stroke-dasharray` / `stroke-dashoffset` for arc segments
- Needle: SVG `<line>` rotated via `transform-origin: center bottom`
- Rotation range: `-90deg` (full left) to `+90deg` (full right), `0deg` = center (perfect)
- Needle angle formula: `angle = clamp(delta / (WARNING_RANGE * 2), -1, 1) * 90`

---

## 10. Phased Rollout

### Phase 1 — Core (build now)
- [x] Gauge UI replacing flat bar
- [x] 4 instruments (violin, cello, guitar, ukulele)
- [x] 3 languages (EN, HE, RU)
- [x] Auto-detect mode
- [x] Stop button
- [x] Scalable instrument config object
- [x] Scalable i18n translation object

### Phase 2 — Polish
- [ ] Dark/light mode toggle
- [ ] PWA manifest + service worker (installable, offline-capable)
- [ ] "Share" button (web share API)
- [ ] Persistent language preference (localStorage)

### Phase 3 — Expand
- [ ] Add more instruments (bass, viola, mandolin, banjo, oud)
- [ ] Add alternate tunings per instrument (drop-D, open G, etc.)
- [ ] Add more languages (Arabic, French, Spanish)
- [ ] Analytics (privacy-respecting, e.g. Plausible)