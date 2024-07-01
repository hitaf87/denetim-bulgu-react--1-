import { Button, Form, Input } from '@kocsistem/oneframe-react-bundle';
import { set } from 'lodash';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sampleFunction } from '../../core/utility';


const NewPasswordComponent = () => {
    const { t } = useTranslation();
    const ref = useRef<any>();
    const [state, setState] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    return (
        <div className="login-container" ref={ref}>
            <div className="login-rightside-form">
                <div className="form-area">
                    <h3>Yeni şifre oluştur</h3>
                    <div className="form">
                        <Form onSubmit={() => {sampleFunction}}>
                            <div className="form-field">
                                <Input
                                    id="email"
                                    name="email"
                                    caption={t('shared.new-password')}
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
                            <div className="form-field">
                                <Input
                                    id="email"
                                    name="email"
                                    caption={t(
                                        'shared.new-password-confirmation',
                                    )}
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
                            <div className="form-field">
                                <Button
                                    type="submit"
                                    fullWidth
                                    className="custom-button-color-blue"
                                    text={t('shared.submit')}
                                />
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPasswordComponent;
