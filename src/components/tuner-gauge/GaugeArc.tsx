interface GaugeArcProps {
    accentColor: string;
    hasSignal: boolean;
}

export function GaugeArc({ accentColor, hasSignal }: GaugeArcProps) {
    return (
        <g style={{ filter: hasSignal ? 'url(#glow-heavy)' : 'none', transition: 'filter 0.45s ease-out' }}>
            <foreignObject x="0" y="0" width="300" height="180" mask="url(#arc-mask)">
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        background: `conic-gradient(from 0deg at 150px 155px, ${accentColor} 0deg, var(--clr-high) 80deg, var(--clr-high) 100deg, transparent 100deg 260deg, var(--clr-low) 260deg, var(--clr-low) 280deg, ${accentColor} 360deg)`,
                    }}
                />
            </foreignObject>
        </g>
    );
}
