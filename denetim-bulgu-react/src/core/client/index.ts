import { jwtTokenParse, toastMessage } from '@kocsistem/oneframe-react-bundle';
import axios from 'axios';

import i18n from '../i18n';
import { LOCAL_STORAGE, MESSAGE_TYPE } from '../../core/constants';
import { getStoredLanguage } from '../../core/utility/translate';
import history from '../../history';
import { ServiceResponse } from '../../models/shared/service-response';
import { ServiceResponseBase } from '../../models/shared/service-response-base';
import { LoginResponse } from '../../models/users/login-response';
import { getLocalStorageItem, setILocalStorageItem } from '../utility';

import { ACCOUNT_SETTINGS } from '../../core/constants/apiEndpoints'; 

const httpClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

httpClient.interceptors.request.use(
    config => {
        const token = getLocalStorageItem(LOCAL_STORAGE.ACCESS_TOKEN);

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        config.headers['Content-Type'] = 'application/json';
        config.headers['Accept-Language'] = getStoredLanguage();
        return config;
    },
    error => {
        Promise.reject(error);
    },
);

const successHandler = (successMessage: string, doNotShowToastr: boolean) => {
    if (!doNotShowToastr && successMessage && successMessage !== '' && successMessage !== null) {
        toastMessage({
            messageType: MESSAGE_TYPE.SUCCESS,
            message: successMessage,
            position: 'topRight',
            icon: 'flaticon-like',
            timeout: 1500,
        });
    }
};

const errorHandler = (err, doNotShowToastr) => {
    let response;
    if (err.response) {
        // client received an error response (5xx, 4xx)
        response = err.response.data as ServiceResponse<any>;
        if (!doNotShowToastr) {
            let msg = '';
            let code = i18n.t('error')
            if (response.error) {
                msg = response.error.message ?? '';
                code =response.error.code;
                if (response.error.validationErrors) {
                    response.error.validationErrors.map(item => {
                        msg += '<br />* ' + item.message;
                    });
                }
            }
            
            toastMessage({
              messageType: MESSAGE_TYPE.ERROR,
              title: code,
              message: msg,
              position: 'center',
              overlay: true,
              icon: 'flaticon-alert',
          });
        }
    } else if (err.request) {
        // client never received a response, or request never left
        response = err.request;
    } else {
        // anything else
        response = err;
    }
    return response;
};
httpClient.interceptors.response.use(
    response => {
        return response;
    },
    function (error) {
        const originalRequest = error.config;
        const baseUrl = process.env.REACT_APP_API_URL;
        if (originalRequest.url === `/accounts/refresh`) {
            history.push('/login');
            return Promise.reject(error);
        }
        if (error.response.status === 401 || (error.response.status === 403 && !originalRequest._retry)) {
            originalRequest._retry = true;
            const refreshToken = getLocalStorageItem(LOCAL_STORAGE.REFRESH_TOKEN);
            const token = getLocalStorageItem(LOCAL_STORAGE.ACCESS_TOKEN);
            if (!refreshToken || !token) {
                history.push('/accounts/login');
                return Promise.reject(error);
            }

            return axios
                .post(`${baseUrl}${ACCOUNT_SETTINGS.REFRESH}`, {
                    refreshToken: getLocalStorageItem(LOCAL_STORAGE.REFRESH_TOKEN),
                    token: getLocalStorageItem(LOCAL_STORAGE.ACCESS_TOKEN),
                })
                .then(
                    response => {
                        const serviceResponse = response.data as ServiceResponse<LoginResponse>;

                        if (serviceResponse && serviceResponse.isSuccessful) {
                            const token: any = jwtTokenParse(serviceResponse.result.token);
                            setILocalStorageItem(LOCAL_STORAGE.ACCESS_TOKEN, serviceResponse.result.token);
                            setILocalStorageItem(LOCAL_STORAGE.EXPIRED_TIME, token.exp);
                            setILocalStorageItem(LOCAL_STORAGE.REFRESH_TOKEN, serviceResponse.result.refreshToken);

                            originalRequest.headers['Authorization'] = 'Bearer ' + getLocalStorageItem(LOCAL_STORAGE.ACCESS_TOKEN);
                            return axios(originalRequest);
                        }
                        history.push('/accounts/login');
                        return Promise.reject(error);
                    },
                    error => {
                        history.push('/accounts/login');
                        return Promise.reject(error);
                    },
                );
        }
        return Promise.reject(error);
    },
);

const get = async <T>(
    endpoint: string,
    successMessage: string = undefined,
    spinnerElementId = undefined,
    doNotShowToastr = false,
): Promise<ServiceResponse<T>> => {
    if (spinnerElementId) {
        // spinnerService.show(spinnerElementId);
    }
    let response = null;
    await httpClient
        .get(endpoint)
        .then(res => {
            response = res.data;
            successHandler(successMessage, doNotShowToastr);
        })
        .catch(err => {
            response = errorHandler(err, doNotShowToastr);
        })
        .finally(() => {
            if (spinnerElementId) {
                // spinnerService.hide(spinnerElementId);
            }
        });
    return response;
};

const put = async <T>(
    endpoint: string,
    body: any,
    successMessage: string = undefined,
    spinnerElementId = undefined,
    doNotShowToastr = false,
): Promise<ServiceResponse<T>> => {
    if (spinnerElementId) {
        // spinnerService.show(spinnerElementId);
    }
    let response = null;
    await httpClient
        .put(endpoint, body)
        .then(res => {
            response = res.data;
            successHandler(successMessage, doNotShowToastr);
        })
        .catch(err => {
            response = errorHandler(err, doNotShowToastr);
        })
        .finally(() => {
            if (spinnerElementId) {
                // spinnerService.hide(spinnerElementId);
            }
        });
    return response;
};

const post = async <T>(
    endpoint: string,
    body: any,
    successMessage: string = undefined,
    spinnerElementId = undefined,
    doNotShowToastr = false,
): Promise<ServiceResponse<T>> => {
    if (spinnerElementId) {
        // spinnerService.show(spinnerElementId);
    }
    let response = null;
    await httpClient
        .post(endpoint, body)
        .then(res => {
            response = res.data;
            successHandler(successMessage, doNotShowToastr);
        })
        .catch(err => {
            response = errorHandler(err, doNotShowToastr);
        })
        .finally(() => {
            if (spinnerElementId) {
                // spinnerService.hide(spinnerElementId);
            }
        });
    return response;
};

const del = async (
    endpoint: string,
    successMessage: string = undefined,
    spinnerElementId = undefined,
    doNotShowToastr = false,
): Promise<ServiceResponseBase> => {
    if (spinnerElementId) {
        // spinnerService.show(spinnerElementId);
    }
    let response = null;
    await httpClient
        .delete(endpoint)
        .then(res => {
            response = '';
            successHandler(successMessage, doNotShowToastr);
        })
        .catch(err => {
            response = errorHandler(err, doNotShowToastr);
        })
        .finally(() => {
            if (spinnerElementId) {
                // spinnerService.hide(spinnerElementId);
            }
        });
    return response;
};

export { httpClient, get, del, put, post };
