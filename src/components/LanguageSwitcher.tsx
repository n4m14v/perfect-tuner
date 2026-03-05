import { useState, useRef, useEffect } from 'react';
import type { Lang } from '../types';
import { useLang } from '../context/LangContext';

const LANGS: { code: Lang; label: string; full: string }[] = [
    { code: 'en', label: 'EN', full: 'English' },
    { code: 'he', label: 'עב', full: 'עברית' },
    { code: 'ru', label: 'РУ', full: 'Русский' },
];

export function LanguageSwitcher() {
    const { lang, setLang } = useLang();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="lang-menu" ref={containerRef}>
            <button
                className={`lang-menu-trigger${isOpen ? ' active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select Language"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="globe-icon">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            </button>

            {isOpen && (
                <div className="lang-dropdown">
                    {LANGS.map(({ code, label, full }) => (
                        <button
                            key={code}
                            className={`lang-option${lang === code ? ' active' : ''}`}
                            onClick={() => {
                                setLang(code);
                                setIsOpen(false);
                            }}
                        >
                            <span className="lang-option-label">{label}</span>
                            <span className="lang-option-full">{full}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
