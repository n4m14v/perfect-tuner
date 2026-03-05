# Project: Perfect Tuner - Mobile Refactor
## Role: Senior UI/UX Engineer & Performance Specialist
## Objective: 
Refactor the Cello Tuner layout for optimal Mobile Web usage. Prioritize the Gauge and Frequency Reader as the primary visual actors while maintaining "Antigravity" aesthetics (glassmorphism, depth, and luminescence).

---

### 1. Technical Stack
- **Framework:** React (Functional Components + Hooks)
- **Build Tool:** Vite
- **Language:** TypeScript (Strict Typing)
- **Styling:** Vanilla CSS (CSS Variables + Flex/Grid)
- **Icons/Visuals:** Inline SVG for precision and performance.

### 2. Layout Architecture (The "Aero-Mobile" Pattern)
Implement a three-tier vertical structure using `100svh` to prevent mobile browser chrome shifts:

1. **Header (10%):** - Slim horizontal bar.
   - Left: "Perfect Tuner - Cello" (Small, elegant typography).
   - Right: Compact Auto-Detect toggle + Settings icon.

2. **The Stage (60%):**
   - **Main Gauge:** Large, high-visibility arc occupying the upper half.
   - **Aero-Delta Reader:** Centered in the negative space below the needle pivot. 
   - **Visuals:** Large glowing Δ Hz value (e.g., +13.1) with a sliding SVG Vernier cent-scale directly beneath it.

3. **Control Dock (30%):**
   - **String Selection:** A 2x2 grid or horizontal carousel of glassmorphic circular buttons (A3, D3, G2, C2).
   - **Ergonomics:** All interactive elements must sit in the "Thumb Zone" (bottom 1/3 of the screen).

---

### 3. Design & Motion Specs
- **Antigravity Style:**
  - Container: `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.1)`.
  - Shadows: Layered `box-shadow` for a floating, weightless effect.
  - Colors: Use CSS Variables for State: 
    - `--color-flat: #FF4B4B;` (Ruby)
    - `--color-sharp: #FFB800;` (Amber)
    - `--color-perfect: #00F0FF;` (Cyan)

- **Performance & Precision:**
  - Use `requestAnimationFrame` or optimized CSS transitions (`cubic-bezier(0.22, 1, 0.36, 1)`) for the SVG scale to ensure zero-jitter on mobile devices.
  - Apply `will-change: transform` to the moving scale elements.

---

### 4. Code Implementation Requirements
1. **TypeScript Interface:**
   ```typescript
   interface TunerProps {
     hearingHz: number;
     targetHz: number;
     cents: number;
     activeString: 'A3' | 'D3' | 'G2' | 'C2';
     isAutoDetect: boolean;
   }

Vanilla CSS: Provide a clear Tuner.css file using CSS Grid for the three-tier layout and Flexbox for the Control Dock.

Accessibility: Minimum touch targets of 44px for all mobile buttons.

---

### Pro-Tip for your Workflow
Since you're a **front-end engineer with 15+ years of experience**, you might want to ask the AI specifically to implement **CSS Custom Properties** for the "Glow Radius". This would allow you to animate the intensity of the background glow based on how close the user is to the "Perfect" frequency in real-time.