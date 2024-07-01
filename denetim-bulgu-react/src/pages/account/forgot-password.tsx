import { Button, Form, Input } from '@kocsistem/oneframe-react-bundle';
import { set } from 'lodash';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Title from '../../components/title';
import { sampleFunction } from '../../core/utility';

const ForgotPasswordComponent = () => {
    const { t } = useTranslation();

    const ref = useRef<any>();
    const [state, setState] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    return (
        <div className="login-container" ref={ref}>
            <div className="login-form">
                <div className="form-area">
                    <Title sub="forgot-password" />
                    <div className="error-container" />
                    <div className="form">
                        <Form
                            onSubmit={() => {
                                sampleFunction;
                            }}>
                            <div className="form-field mb-4">
                                <Input
                                    id="email"
                                    name="email"
                                    caption={t('shared.email')}
                                    className="custom-login-field"
                                    value={state!.email || ''}
                                    onChange={(e: any) =>
                                        setState({
                                            ...set(
                                                state,
                                                e.target.name,
                                                e.target.value,
                                            ),
                                        })
                                    }
                                    validate={[
                                        {
                                            required: 'required',
                                            message: t('shared.required'),
                                        },
                                        {
                                            required: 'email',
                                            message: t(
                                                'shared.email-address-required-message',
                                            ),
                                        },
                                    ]}
                                />
                            </div>
                            <div className="form-field mb-4">
                                <Button
                                    type="submit"
                                    fullWidth
                                    className="custom-button-blue-50"
                                    text={'Send'}
                                    iconRight={() => (
                                        <i className="fad fa-share ml-2" />
                                    )}
                                />
                            </div>
                            <hr className="mt-4 mb-4" />
                            <div className="form-field mt-4">
                                <Link to="/accounts/login">
                                    {t('auth.form.buttons.back-to-login')}
                                </Link>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordComponent;
