import type { Lang } from '../types';

export interface Translations {
    pick_string: string;
    play_string: (note: string) => string;
    play_any: string;
    perfect: string;
    in_tune: string;
    too_low: string;
    way_too_low: string;
    too_high: string;
    way_too_high: string;
    tighten: string;
    loosen: string;
    auto_detect: string;
    auto_on: string;
    auto_off: string;
    stop: string;
    mic_prompt: string;
    mic_denied: string;
    tip_low: string;
    tip_ok: string;
    tip_high: string;
    hearing: string;
    target: string;
    footer: string;
    hold_steady: string;
    gauge_tighten: string;
    gauge_perfect: string;
    gauge_loosen: string;
    app_title: string;
    title_separator: string;
    info_title: string;
    info_p1: string;
    info_p2: string;
    info_p3: string;
    info_auto_title: string;
    info_auto_desc: string;
    info_close: string;
}

const T: Record<Lang, Translations> = {
    en: {
        pick_string: 'Pick a string to start',
        play_string: (note) => `Play the ${note} string!`,
        play_any: 'Play any string!',
        perfect: 'Perfect!',
        in_tune: 'Your string is in tune',
        too_low: 'A little low',
        way_too_low: 'Way too low!',
        too_high: 'A little high',
        way_too_high: 'Way too high!',
        tighten: 'Tighten the string slowly',
        loosen: 'Loosen the string slowly',
        auto_detect: 'Auto-detect',
        auto_on: 'On',
        auto_off: 'Off',
        stop: 'Microphone',
        mic_prompt: 'Allow mic access when your browser asks!',
        mic_denied: 'Mic access denied — please reload the page.',
        tip_low: 'Too low?\nTighten the peg',
        tip_ok: "In the green?\nYou're in tune!",
        tip_high: 'Too high?\nLoosen the peg',
        hearing: 'Hearing',
        target: 'Target',
        footer: 'Free forever · Works in any modern browser',
        hold_steady: 'Hold the instrument near the microphone',
        gauge_tighten: 'TIGHTEN',
        gauge_perfect: 'PERFECT',
        gauge_loosen: 'LOOSEN',
        app_title: 'Perfect Tuner',
        title_separator: ' | ',
        info_title: 'How to use the Tuner',
        info_p1: '1. Select the string you want to tune from the bottom dock.',
        info_p2: '2. Pluck the string on your instrument loudly and clearly.',
        info_p3: '3. Follow the gauge instructions. If it says "TIGHTEN", carefully turn the tuning peg to raise the pitch. If it says "LOOSEN", turn it the other way to lower it.',
        info_auto_title: 'Using AUTO Mode',
        info_auto_desc: 'Tap the glowing center AUTO hub! The app will automatically listen and figure out which string you are trying to tune. You won\'t need to tap the manual string buttons.',
        info_close: 'Got it!',
    },
    he: {
        pick_string: 'בחר מיתר להתחיל',
        play_string: (note) => `נגן על המיתר ${note}!`,
        play_any: 'נגן על כל מיתר!',
        perfect: 'מושלם!',
        in_tune: 'המיתר שלך מכוון',
        too_low: 'קצת נמוך מדי',
        way_too_low: 'נמוך מדי!',
        too_high: 'קצת גבוה מדי',
        way_too_high: 'גבוה מדי!',
        tighten: 'הדק את המיתר לאט',
        loosen: 'שחרר את המיתר לאט',
        auto_detect: 'זיהוי אוטומטי',
        auto_on: 'פעיל',
        auto_off: 'כבוי',
        stop: 'מיקרופון',
        mic_prompt: 'אפשר גישה למיקרופון כאשר הדפדפן שואל!',
        mic_denied: 'גישה למיקרופון נדחתה — טען מחדש.',
        tip_low: 'נמוך?\nהדק את הפין',
        tip_ok: 'בירוק?\nאתה מכוון!',
        tip_high: 'גבוה?\nשחרר את הפין',
        hearing: 'מזוהה',
        target: 'יעד',
        footer: 'חינם לנצח · עובד בכל דפדפן מודרני',
        hold_steady: 'קרב את הכלי למיקרופון',
        gauge_tighten: 'להדק',
        gauge_perfect: 'מושלם',
        gauge_loosen: 'לשחרר',
        app_title: 'מכוון מושלם',
        title_separator: ' | ',
        info_title: 'איך להשתמש במכוון',
        info_p1: '1. בחר איזה מיתר ברצונך לכוון באמצעות הכפתורים למטה.',
        info_p2: '2. פרוט על המיתר בכלי שלך בקול רם וברור.',
        info_p3: '3. עקוב אחר הוראות המדחום. אם כתוב "להדק", סובב בזהירות את מפתח הכיוון כדי להעלות את הצליל. אם כתוב "לשחרר", סובב לצד השני.',
        info_auto_title: 'שימוש במצב AUTO',
        info_auto_desc: 'הקש על עיגול ה-AUTO באמצע! האפליקציה תקשיב ותזהה אוטומטית איזה מיתר אתה מנסה לכוון, כך שלא תצטרך ללחוץ על הלחצנים ידנית.',
        info_close: 'הבנתי!',
    },
    ru: {
        pick_string: 'Выберите струну для начала',
        play_string: (note) => `Играйте струну ${note}!`,
        play_any: 'Играйте любую струну!',
        perfect: 'Отлично!',
        in_tune: 'Ваша струна настроена',
        too_low: 'Немного занижено',
        way_too_low: 'Сильно занижено!',
        too_high: 'Немного завышено',
        way_too_high: 'Сильно завышено!',
        tighten: 'Натяните струну медленно',
        loosen: 'Ослабьте струну медленно',
        auto_detect: 'Авто-определение',
        auto_on: 'Вкл',
        auto_off: 'Выкл',
        stop: 'Микрофон',
        mic_prompt: 'Разрешите доступ к микрофону!',
        mic_denied: 'Доступ к микрофону отклонён — перезагрузите страницу.',
        tip_low: 'Низко?\nПодтяните колок',
        tip_ok: 'В зелёном?\nВы в строе!',
        tip_high: 'Высоко?\nОслабьте колок',
        hearing: 'Слышу',
        target: 'Цель',
        footer: 'Бесплатно навсегда · Работает в любом браузере',
        hold_steady: 'Держите инструмент у микрофона',
        gauge_tighten: 'НАТЯНИ',
        gauge_perfect: 'ИДЕАЛЬНО',
        gauge_loosen: 'РАССЛАБЬ',
        app_title: 'Идеальный тюнер',
        title_separator: ' | ',
        info_title: 'Как использовать тюнер',
        info_p1: '1. Выберите струну, которую вы хотите настроить, в нижней панели.',
        info_p2: '2. Сыграйте на струне вашего инструмента громко и четко.',
        info_p3: '3. Следуйте инструкциям на шкале. Если написано "НАТЯНИ", осторожно поверните колок, чтобы повысить тон. Если "РАССЛАБЬ", поверните в другую сторону.',
        info_auto_title: 'Режим AUTO',
        info_auto_desc: 'Нажмите на центральную кнопку AUTO! Приложение будет автоматически слушать и диагностировать, какую струну вы пытаетесь настроить, без ручного переключения.',
        info_close: 'Понятно!',
    },
};

export function useTranslations(lang: Lang): Translations {
    return T[lang];
}
