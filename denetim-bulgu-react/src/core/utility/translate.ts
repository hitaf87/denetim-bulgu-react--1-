import i18n from 'i18next';

export const getStoredLanguage = () =>
    i18n.language ||
    (typeof window !== 'undefined' && window.localStorage.i18nextLng) ||
    'en-US';
