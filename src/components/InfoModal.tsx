import { useEffect, useRef } from 'react';
import type { Translations } from '../config/translations';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    t: Translations;
    accentColor: string;
}

export function InfoModal({ isOpen, onClose, t, accentColor }: Props) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    return (
        <div className="info-modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
            <div className="info-modal-content" style={{ '--modal-accent': accentColor } as React.CSSProperties}>
                <button className="info-modal-close-icon" onClick={onClose} aria-label="Close">
                    &times;
                </button>
                <h2 className="info-modal-title" style={{ color: accentColor }}>{t.info_title}</h2>
                <div className="info-modal-body">
                    <p>{t.info_p1}</p>
                    <p>{t.info_p2}</p>
                    <p>{t.info_p3}</p>

                    <h3 className="info-modal-subtitle" style={{ color: accentColor }}>{t.info_auto_title}</h3>
                    <p>{t.info_auto_desc}</p>
                </div>
                <button
                    className="info-modal-close-btn"
                    onClick={onClose}
                    style={{ background: accentColor }}
                >
                    {t.info_close}
                </button>
            </div>
        </div>
    );
}
