import { Button, Form, Input } from '@kocsistem/oneframe-react-bundle';
import qrCode from 'qrcode';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import Title from '../../components/title';
import { post } from '../../core/client';
import { LOCAL_STORAGE,TWO_FA_VERIFICATION_TYPE } from '../../core/constants';
import { AUTHENTICATIONS_SETTINGS } from '../../core/constants/apiEndpoints';
import { TwoFactorVerificationModel } from '../../models/authentication';

const Login2Fa = (props: any) => {
    const { t } = useTranslation();
    const history: any = useHistory();

    const verificationTimeStorage = parseInt(localStorage.getItem(LOCAL_STORAGE.TWOFA_VERIFICATION_TIME));
    const verificationTypeStorage = localStorage.getItem(LOCAL_STORAGE.TWOFA_VERIFICATION_TYPE);
    const userNameStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER_EMAIL));

    const initialState: TwoFactorVerificationModel = {
        verificationType: verificationTypeStorage,
        userName: userNameStorage,
        verificationCode: '',
    };

    const [state, setState] = useState<TwoFactorVerificationModel>(initialState);
    const [remainTime, setRemainTime] = useState(verificationTimeStorage);
    const [btnResendEnable, setBtnResendEnable] = useState(false);
    const [isAuthenticator, setIsAuthenticator] = useState(false);
    const [authenticatorIsActivated, setAuthenticatorIsActivated] = useState(true);
    const [src, setSrc] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const timer = () => {
        const startTime = new Date().getTime() + verificationTimeStorage * 1000;

        setInterval(() => {
            const now = new Date().getTime();
            const timeleft = startTime - now;

            const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
            setRemainTime(seconds);

            if (seconds < 1) {
                clearInterval();
                setRemainTime(0);
                setBtnResendEnable(true);
            }
        }, 1000);
    };

    const sendVerificationCode = async () => {
        const response = await post<any>(`${AUTHENTICATIONS_SETTINGS.SEND_VERIFICATION_CODE}`, { ...state });
        if (response?.isSuccessful) {
            setPhoneNumber(response.result);
        }
    };

    const generateAuthenticatorCode = async () => {
        const response = await post<any>(`${AUTHENTICATIONS_SETTINGS.GENERATE_AUTHENTICATOR_SHARED_KEY}`, userNameStorage);
        if (response?.isSuccessful) {
            setAuthenticatorIsActivated(response.result['isActivated']);
            const authenticatorLinkName = localStorage.getItem(LOCAL_STORAGE.TWOFA_AUTHENTICATOR_LINK_NAME);
            const sharedKey = response.result['sharedKey'];
            const qrcodeUri = `otpauth://totp/${authenticatorLinkName}:${userNameStorage}?secret=${sharedKey}&issuer=${authenticatorLinkName}`;
            qrCode.toDataURL(qrcodeUri).then(setSrc);
        }
    };

    useEffect(() => {      
        if (verificationTypeStorage === TWO_FA_VERIFICATION_TYPE.AUTHENTICATOR) {
            setIsAuthenticator(true);
            generateAuthenticatorCode();
        } else {
            sendVerificationCode();
            timer();
        }
    }, []);

    const changeValidation = (e: any) => {
        setState((prevState: TwoFactorVerificationModel) => ({
            ...prevState,
            verificationCode: e.target.value,
        }));
    };

    const handleValidate = async () => {
        const response = await post<any>(`${AUTHENTICATIONS_SETTINGS.TWO_FACTOR_VERIFICATION_CODE}`, { ...state }, t('shared.login-success'));
        if (response?.isSuccessful) {
            history.push('/dashboard');
        }
    };

    const handleResend = () => {
        window.location.reload();
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="form-area">
                    <Title sub="login" />
                    <div className="error-container" />
                    <div className="form">
                        <Form onSubmit={() => handleValidate()}>
                            <div className="form-field mb-4">
                                <h4>{t('auth.form.labels.two-factor-title')}</h4>
                                <p>{`${t('auth.form.labels.two-factor-type')}: ${verificationTypeStorage}`} </p>
                                {phoneNumber && (<><br/><p>{`${t('auth.form.labels.two-factor-phone-number')}: ${phoneNumber}`}</p></>)}                                
                            </div>
                            {isAuthenticator && !authenticatorIsActivated && (
                                <div>
                                    <div className="form-field mb-4">
                                        <p>{t('auth.form.labels.authenticator-info-message')}</p>
                                    </div>
                                    <div className="form-field mb-4 center">
                                        <img src={src} alt="qrcode" />
                                    </div>
                                </div>
                            )}
                            <div className="form-field mb-4">
                                <Input
                                    id="validationCode"
                                    name="validationCode"
                                    type="number"
                                    caption={t('auth.form.labels.validation-code')}
                                    className="custom-login-field"
                                    value={''}
                                    onChange={changeValidation}
                                    validate={[{ required: 'required', message: t('shared.required') }]}
                                />
                            </div>
                            {!isAuthenticator && (
                                <div className="form-field mb-4">
                                    <div className="row">
                                        <div className="col-sm-6 mb-2">{t('auth.form.labels.remain-time')}</div>
                                        <div className="col-sm-6 mb-2">
                                            {remainTime} {t('auth.form.labels.second')}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="form-field mb-4">
                                {!btnResendEnable ? (<Button
                                    id="btnValidate"
                                    type="submit"
                                    fullWidth
                                    className="custom-button-blue-50"
                                    text={t('auth.form.buttons.validate')}
                                    iconRight={() => <i className="fad fa-arrow-right ml-2" />}
                                />): (<Button
                                    id="btnResend"
                                    type="button"
                                    fullWidth
                                    className="custom-button-blue-50"
                                    text={t('auth.form.buttons.resend')}
                                    iconRight={() => <i className="fad fa-arrow-right ml-2" />}
                                    onClick={handleResend}
                                />)}
                            </div>
                            <div className="form-field mb-4"></div>
                            <hr className="mt-4 mb-4" />
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login2Fa;
