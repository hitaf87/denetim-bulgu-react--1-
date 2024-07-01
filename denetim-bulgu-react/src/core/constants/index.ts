import { ActionIconModel } from '../../models/shared/grid-helpers';
import i18n from '../i18n';

export const LOCAL_STORAGE = {
    ACCESS_TOKEN: 'ACCESS_TOKEN',
    USER_ID: 'USER_ID',
    USER_FULLNAME: 'USER_FULLNAME',
    PERMISSIONS: 'PERMISSIONS',
    USER_EMAIL: 'USER_EMAIL',
    EXPIRED_TIME: 'EXPIRED_TIME',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
    POSITION: 'POSITION',
    AUTO_LOGOUT_EXPIRED: 'AUTO_LOGOUT_EXPIRED',
    LAST_ACTIVITY_TIME: 'LAST_ACTIVITY_TIME',
    AUTO_LOGOUT_DIALOG_TIMEOUT: 'Identity:AutoLogout:DialogTimeout',
    AUTO_LOGOUT_IDLE_TIMEOUT: 'Identity:AutoLogout:IdleTimeout',
    TWOFA_AUTHENTICATOR_LINK_NAME: 'Identity:2FASettings:AuthenticatorLinkName',
    TWOFA_IS_ENABLED: 'Identity:2FASettings:IsEnabled',
    TWOFA_VERIFICATION_TIME: 'Identity:2FASettings:VerificationTime',
    TWOFA_VERIFICATION_TYPE: 'Identity:2FASettings:Type',
};

export const MESSAGE_TYPE = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
};

export const GOOGLE_RECAPTCHA_ERROR = {
    ScriptNotAvailable: 'Recaptcha script is not available',
};

export const GRID_ACTIONS_EDIT_DELETE: Array<ActionIconModel> = [
    {
        name: 'edit',
        icon: 'flaticon-edit icon-xs',
        tooltip: i18n.t('shared.edit'),
    },
    {
        name: 'delete',
        icon: 'flaticon-delete icon-xs',
        tooltip: i18n.t('shared.edit'),
    },
];

export const GRID_ACTIONS_EDIT: Array<ActionIconModel> = [
    GRID_ACTIONS_EDIT_DELETE[0],
];

export const GRID_ACTIONS_DELETE: Array<ActionIconModel> = [
    GRID_ACTIONS_EDIT_DELETE[1],
];

export const GRID_PAGE_SIZE_OPTIONS: Array<number> = [5, 10, 25];

export const TWO_FA_VERIFICATION_TYPE = {
    EMAIL: 'Email',
    SMS: 'Sms',
    AUTHENTICATOR: 'Authenticator'
}

export const GRID_ACTIONS_DETAIL_SEND: Array<ActionIconModel> = [
    {
        name: 'detail',
        icon: 'flaticon-file-2 icon-xs',
        tooltip: i18n.t('shared.detail'),
    },
    {
        name: 'send',
        icon: 'flaticon-paper-plane icon-xs',
        tooltip: i18n.t('shared.send'),
    },
];