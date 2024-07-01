import React from 'react';

import { sampleFunction } from './core/utility';
import { getStoredLanguage } from './core/utility/translate';

const LanguageContext = React.createContext({
    language: getStoredLanguage(),
    setLanguage: (value: any) => {
        sampleFunction;
    },
});
export default LanguageContext;
