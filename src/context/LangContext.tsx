import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Lang } from '../types';

interface LangCtx {
    lang: Lang;
    setLang: (l: Lang) => void;
}

const LangContext = createContext<LangCtx>({ lang: 'en', setLang: () => { } });

function detectLang(): Lang {
    const code = navigator.language.split('-')[0];
    if (code === 'he' || code === 'iw') return 'he';
    if (code === 'ru') return 'ru';
    return 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>(detectLang);

    const setLang = (l: Lang) => {
        setLangState(l);
        document.documentElement.lang = l;
        document.documentElement.dir = l === 'he' ? 'rtl' : 'ltr';
    };

    // Apply on mount
    useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
