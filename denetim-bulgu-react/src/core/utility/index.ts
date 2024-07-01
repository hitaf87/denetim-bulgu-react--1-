import { jwtTokenParse } from '@kocsistem/oneframe-react-bundle';

import { LOCAL_STORAGE } from '../constants';

export const sampleFunction = () => {
    console.log('sampleFunction', 'file: core/utility/index.ts');
};

export const getLocalStorageItem = (key: string) => {
    const item: any = window.localStorage.getItem(key);
    return item !== 'undefined' ? JSON.parse(item) : null;
};

export const setILocalStorageItem = (key: string, value: any) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorageItem = (key: string) => {
    window.localStorage.removeItem(key);
};

export const tokenIsExpired = (tokenToCheck: any) => {
    if (tokenToCheck == null) return true;

    const token: any = jwtTokenParse(tokenToCheck);
    const expireTime = token.exp;
    const currentTime: any = new Date().getTime() / 1000;

    return currentTime > expireTime;
};

export const getActiveToken = (checkExpiration = false) => {
    const token: any = getLocalStorageItem(LOCAL_STORAGE.ACCESS_TOKEN);
    if (checkExpiration && token && tokenIsExpired(token)) return null;
    return token;
};

export const isAllTokenInvalid = () => {
    const isTokenExpired = getActiveToken(true) == null;
    const isRefreshTokenExpired = tokenIsExpired(
        getLocalStorageItem(LOCAL_STORAGE.REFRESH_TOKEN),
    );

    return isTokenExpired && isRefreshTokenExpired;
};

export const getApiBaseUrl = () => {
    return process.env.REACT_APP_API_URL;
};

export function isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

export default function deepmerge(
    target: any,
    source: any,
    options: any = { clone: true },
) {
    const output: any = options.clone ? { ...target } : target;

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (key === '__proto__') {
                return;
            }

            if (isObject(source[key]) && key in target) {
                output[key] = deepmerge(target[key], source[key], options);
            } else {
                output[key] = source[key];
            }
        });
    }

    return output;
}

export const ByteArrayToFileDownload = (response: any) => {
    const binaryString = atob(response.result.fileByteArray);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);

    for (let i = 0; i < binaryLen; i++){
        const ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }

    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute(
        'download',
        response.result.fileName,
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
}
