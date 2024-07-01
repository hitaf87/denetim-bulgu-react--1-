import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { getStoredLanguage } from '../utility/translate';
// APPLICATION SETTINGS CATEGORY
import applicationSettingCategoryEn from './locales/application-settings-category/en/translation.json';
import applicationSettingCategoryTr from './locales/application-settings-category/tr/translation.json';
// APPLICATION SETTINGS 
import applicationSettingsEn from './locales/application-settings/en/translation.json';
import applicationSettingsTr from './locales/application-settings/tr/translation.json';
//AUTH
import authEn from './locales/auth/en/translation.json';
import authTr from './locales/auth/tr/translation.json';
// Static Menu
import menuDataEn from './locales/menu/en/translation.json';
import menuDataTr from './locales/menu/tr/translation.json';
//USERS
import reportEn from './locales/report/en/translation.json';
import reportTr from './locales/report/tr/translation.json';
// CLAIMS
import roleClaimsEn from './locales/role-management/role-claims/en/translation.json';
import roleClaimsTr from './locales/role-management/role-claims/tr/translation.json';
//ROLE MANAGEMENT
import roleEn from './locales/role-management/roles/en/translation.json';
import roleTr from './locales/role-management/roles/tr/translation.json';
// Static Menu
import sharedEn from './locales/shared/en/translation.json';
import sharedTr from './locales/shared/tr/translation.json';
// CLAIMS
import usersClaimsEn from './locales/user-management/user-claims/en/translation.json';
import usersClaimsTr from './locales/user-management/user-claims/tr/translation.json';
//USERS
import usersEn from './locales/user-management/users/en/translation.json';
import usersTr from './locales/user-management/users/tr/translation.json';
//AUTO LOGOUT
import autoLogoutEn from './locales/auto-logout/en/translation.json';
import autoLogoutTr from './locales/auto-logout/tr/translation.json';
const resources = {
    en: {
        translation: {
            shared: sharedEn,
            MENUDATA: menuDataEn,
            auth: authEn,
            userManagement: {
                users: usersEn,
                claims: usersClaimsEn,
            },
            roleManagement: {
                roles: roleEn,
                claims: roleClaimsEn,
            },
            applicationSettingsCategory: applicationSettingCategoryEn,
            applicationSettings: applicationSettingsEn,
            report: reportEn,
            autoLogout: autoLogoutEn
        },
    },
    tr: {
        translation: {
            shared: sharedTr,
            MENUDATA: menuDataTr,
            auth: authTr,
            userManagement: {
                users: usersTr,
                claims: usersClaimsTr,
            },
            roleManagement: {
                roles: roleTr,
                claims: roleClaimsTr,
            },
            applicationSettingsCategory: applicationSettingCategoryTr,
            applicationSettings: applicationSettingsTr,
            report: reportTr,
            autoLogout: autoLogoutTr
        },
    },
};

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        fallbackLng: 'en-US',
        debug: false,
        resources,
        lng: getStoredLanguage(),
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    });

export default i18n;
