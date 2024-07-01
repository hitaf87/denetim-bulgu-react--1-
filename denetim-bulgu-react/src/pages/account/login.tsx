import { Button, Checkbox, Form, Input, jwtTokenParse, toastMessage } from '@kocsistem/oneframe-react-bundle';
import { get } from 'lodash';
import React, { useRef, useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Title from '../../components/title';
import { get as getRequest, post } from '../../core/client';
import { LOCAL_STORAGE, MESSAGE_TYPE } from '../../core/constants';
import { CONFIGURATIONS_SETTINGS } from '../../core/constants/apiEndpoints';
import { setILocalStorageItem } from '../../core/utility';
import { LoginResponse } from '../../models/users/login-response';

import { ACCOUNT_SETTINGS } from '../../core/constants/apiEndpoints'; 

require('es6-promise').polyfill();

const Login = ({ location, history }: any) => {
    const is2FaEnabled = localStorage.getItem(LOCAL_STORAGE.TWOFA_VERIFICATION_TYPE);
    const { t } = useTranslation();
    const ref = useRef<any>();

    const [pageReady, setPageReady] = useState(true);
    const [state, setState] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    setILocalStorageItem(LOCAL_STORAGE.REFRESH_TOKEN, null);

    const postLogin = async (fromUrl: string) => {
        const response = await post<LoginResponse>(`${ACCOUNT_SETTINGS.LOGIN}`, { ...state }, !is2FaEnabled && t('shared.login-success'));
        if (response && response.isSuccessful) {
            const token: any = jwtTokenParse(response.result.token);
            setILocalStorageItem(LOCAL_STORAGE.ACCESS_TOKEN, response.result.token);
            setILocalStorageItem(LOCAL_STORAGE.REFRESH_TOKEN, response.result.refreshToken);
            setILocalStorageItem(LOCAL_STORAGE.USER_FULLNAME, token.given_name + ' ' + token.family_name);
            setILocalStorageItem(LOCAL_STORAGE.USER_EMAIL, token.unique_name);
            setILocalStorageItem(LOCAL_STORAGE.EXPIRED_TIME, token.exp);
            if (is2FaEnabled) {
                history.push('/accounts/login-2fa');
            } else {
                history.push(fromUrl);
            }
        }
    };

    const captchaObject = useRef<HTMLElement | any>(null);

    const handleSubmit = async () => {
        setPageReady(false);
        let fromUrl = get(location, 'state.from') || '/';
        if (is2FaEnabled) {
            fromUrl = `/accounts/login-2fa`;
        }

        const token = await captchaObject.current.executeAsync();
        const res = await getRequest(`${ACCOUNT_SETTINGS.IS_CAPTCHA_PASSED}${token}`);

        if (res.result) {
            await postLogin(fromUrl).finally(() => {
                setPageReady(true);
            });
        } else {
            toastMessage({
                messageType: MESSAGE_TYPE.ERROR,
                title: 'Captcha',
                message: t('shared.captcha-validation'),
                position: 'center',
                overlay: true,
                icon: 'flaticon-alert',
            });
        }
    };

    const handleChange = (e: any) => {
        const target = e.target;
        const name = target.name;
        const value = target.value === undefined ? target.checked : target.value;

        setState(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    useEffect(() => {
        twoFaSettings();
    }, []);

    const twoFaSettings = async () => {
        const isEnabledStorage = localStorage.getItem(LOCAL_STORAGE.TWOFA_IS_ENABLED);
        const verificationTypeStorage = localStorage.getItem(LOCAL_STORAGE.TWOFA_VERIFICATION_TYPE);
        const verificationTimeStorage = localStorage.getItem(LOCAL_STORAGE.TWOFA_VERIFICATION_TIME);
        const authenticatorLinkNameStorage = localStorage.getItem(LOCAL_STORAGE.TWOFA_AUTHENTICATOR_LINK_NAME);

        if (
            valueNullControl(isEnabledStorage) ||
            valueNullControl(verificationTypeStorage) ||
            valueNullControl(verificationTimeStorage) ||
            valueNullControl(authenticatorLinkNameStorage)
        ) {
            const endpoint = `${CONFIGURATIONS_SETTINGS.REACT}`;
            const response = await post<any>(endpoint, [
                LOCAL_STORAGE.TWOFA_IS_ENABLED,
                LOCAL_STORAGE.TWOFA_VERIFICATION_TYPE,
                LOCAL_STORAGE.TWOFA_VERIFICATION_TIME,
                LOCAL_STORAGE.TWOFA_AUTHENTICATOR_LINK_NAME,
            ]);

            if (response && response.isSuccessful) {
                const is2FaEnabled = response.result[LOCAL_STORAGE.TWOFA_IS_ENABLED];
                localStorage.setItem(LOCAL_STORAGE.TWOFA_IS_ENABLED, response.result[LOCAL_STORAGE.TWOFA_IS_ENABLED]);

                if (is2FaEnabled) {
                    localStorage.setItem(LOCAL_STORAGE.TWOFA_VERIFICATION_TYPE, response.result[LOCAL_STORAGE.TWOFA_VERIFICATION_TYPE]);
                    localStorage.setItem(LOCAL_STORAGE.TWOFA_VERIFICATION_TIME, response.result[LOCAL_STORAGE.TWOFA_VERIFICATION_TIME]);
                    localStorage.setItem(LOCAL_STORAGE.TWOFA_AUTHENTICATOR_LINK_NAME, response.result[LOCAL_STORAGE.TWOFA_AUTHENTICATOR_LINK_NAME]);
                }
            }
        }
    };

    const valueNullControl = value => {
        if (value === null || value === '' || value === 'undefined') {
            return true;
        } else {
            return false;
        }
    };

    return (
        <div className="login-container" ref={ref}>
            <div className="login-form">
                <div className="form-area">
                    <Title sub="login" />
                    <div className="error-container" />
                    <div className="form">
                        <Form onSubmit={() => handleSubmit()}>
                            <ReCAPTCHA ref={captchaObject} size="invisible" sitekey="6LdHtXgeAAAAAJS2cisnoR0n3952AzjjtwU0zTWt" />
                            <div className="form-field mb-4">
                                <Input
                                    id="email"
                                    name="email"
                                    caption={t('auth.form.labels.email')}
                                    className="custom-login-field"
                                    value={state.email || ''}
                                    onChange={handleChange}
                                    validate={[
                                        { required: 'required', message: t('shared.required') },
                                        { required: 'email', message: t('shared.email-address-required-message') },
                                    ]}
                                />
                            </div>
                            <div className="form-field mb-4">
                                <Input
                                    id="password"
                                    name="password"
                                    caption={t('auth.form.labels.password')}
                                    type="password"
                                    className="custom-login-field"
                                    value={state.password || ''}
                                    onChange={handleChange}
                                    validate={[{ required: 'required', message: t('shared.required') }]}
                                />
                            </div>
                            <div className="form-field mb-4">
                                <Checkbox
                                    id="rememberMe"
                                    name="rememberMe"
                                    label={t('auth.form.labels.remember-me')}
                                    checked={state.rememberMe || false}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-field mb-4">
                                <Link to={'/accounts/forgot-password'} className="">
                                    {t('auth.form.forget-password')}
                                </Link>
                            </div>
                            <div className="form-field mb-4">
                                <Button
                                    disabled={!pageReady}
                                    loading={!pageReady}
                                    type="submit"
                                    fullWidth
                                    className="custom-button-blue-50"
                                    text={t('auth.form.buttons.login')}
                                    iconRight={() => <i className="fad fa-arrow-right ml-2" />}
                                />
                            </div>
                            <hr className="mt-4 mb-4" />
                            <div className="form-field mt-4">
                                {t('auth.form.sign-up.text')}
                                <Link to="/accounts/register"> {t('auth.form.sign-up.link')}</Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
