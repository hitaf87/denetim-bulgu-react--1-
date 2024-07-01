import { Button, Form, Input } from '@kocsistem/oneframe-react-bundle';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Title from '../../components/title';
import { post } from '../../core/client';

import { ACCOUNT_SETTINGS } from '../../core/constants/apiEndpoints'; 

const Register = ({ location, history }: any) => {
    const { t } = useTranslation();

    const ref = useRef<any>();

    const [state, setState] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e: any) => {
        setState(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleRegister = async () => {
        const response = await post<any>(`${ACCOUNT_SETTINGS.REGISTER}`, { ...state }, t('shared.register-success'));
        if (response && response.isSuccessful) {
            history.push('/accounts/login');
        }
    };

    return (
        <div className="login-container" ref={ref}>
            <div className="login-form">
                <div className="form-area">
                    <Title sub="register" />
                    <div className="error-container" />
                    <div className="form pt-0">
                        <Form onSubmit={() => handleRegister()}>
                            <div className="form-field mb-4">
                                <Input
                                    id="name"
                                    name="name"
                                    caption={t('shared.name')}
                                    className="custom-login-field"
                                    value={state?.name || ''}
                                    onChange={handleChange}
                                    validate={[
                                        {
                                            required: 'required',
                                            message: t('shared.required'),
                                        },
                                    ]}
                                />
                            </div>
                            <div className="form-field mb-4">
                                <Input
                                    id="surname"
                                    name="surname"
                                    caption={t('shared.surname')}
                                    className="custom-login-field"
                                    value={state?.surname || ''}
                                    onChange={handleChange}
                                    validate={[
                                        {
                                            required: 'required',
                                            message: t('shared.required'),
                                        },
                                    ]}
                                />
                            </div>
                            <div className="form-field mb-4">
                                <Input
                                    id="email"
                                    name="email"
                                    caption={t('shared.email')}
                                    className="custom-login-field"
                                    value={state?.email || ''}
                                    onChange={handleChange}
                                    validate={[
                                        {
                                            required: 'required',
                                            message: t('shared.required'),
                                        },
                                        {
                                            required: 'email',
                                            message: t('shared.email-address-required-message'),
                                        },
                                    ]}
                                />
                            </div>
                            <div className="form-field mb-4">
                                <Input
                                    id="password"
                                    name="password"
                                    caption={t('shared.new-password')}
                                    type="password"
                                    className="custom-login-field"
                                    value={state?.password || ''}
                                    onChange={handleChange}
                                    validate={[
                                        {
                                            required: 'required',
                                            message: t('shared.required'),
                                        },
                                    ]}
                                />
                            </div>
                            <div className="form-field mb-4">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    caption={t('shared.new-password-confirmation')}
                                    type="password"
                                    className="custom-login-field"
                                    value={''}
                                    validate={[
                                        {
                                            required: 'required',
                                            message: t('shared.required'),
                                        },
                                        {
                                            required: 'custom',
                                            validate: e => {
                                                if (e === state.password) {
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            },
                                            message: t('shared.new-password-confirmation-message'),
                                        },
                                    ]}
                                />
                            </div>
                            <div className="form-field mb-4">
                                <Button
                                    type="submit"
                                    fullWidth
                                    className="custom-button-blue-50"
                                    text="Register"
                                    iconRight={() => <i className="fad fa-arrow-right ml-2" />}
                                />
                            </div>
                            <hr className="mt-4 mb-4" />
                            <div className="form-field mt-4 pb-4">
                                <Link to="/accounts/login">{t('shared.sign-in')}</Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
