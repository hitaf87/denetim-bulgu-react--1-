import { Button, Form, Input } from '@kocsistem/oneframe-react-bundle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { post } from '../../../core/client';

export interface DialogProps {
    show: boolean;
    onClose: (value: boolean) => void;
    saved: (value: boolean) => void;
    refreshData: (value: boolean) => void;
}

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <div className="row">
                    <div className="col-lg-12">{children}</div>
                </div>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const CreateRoleComponent = ({ onClose, show, saved, refreshData }: DialogProps) => {
    const { t } = useTranslation();

    const [tabValue, setTabValue] = useState(0);
        
    const getInitialState = () => {
        return {
            name: '',
            translations: [
                {
                    language: 'tr',
                    displayText: '',
                    description: '',
                },
                {
                    language: 'en',
                    displayText: '',
                    description: '',
                },
                {
                    language: 'ar',
                    displayText: '',
                    description: '',
                },
            ]
        };
    };

    const [state, setState] = useState(getInitialState());    


    const handleClose = (value: boolean) => {
        onClose(value);
        setTabValue(0);
    };

    const handleChange = (e: any, i: number) => {
        if (i < 0) {
            setState((prevState: any) => ({
                ...prevState,
                [e.target.name]: e.target.value,
            }));
        } else {
            const change = { ...state };
            change.translations[i][e.target.name] = e.target.value;

            setState((prevState: any) => ({
                ...prevState,
                ...change,
            }));
        }
    };

    const handleSubmit = async () => {
        const endpoint = `/roles`;
        await post<any>(endpoint, state, t('shared.save-success'));
        saved(true);
        setState(getInitialState());
        setTabValue(0);
        refreshData(true);
    };

    const handleChangeTabs = (event: any, newValue: any) => {
        setTabValue(newValue);
    };

    return (
        <>
            <Dialog open={show} onClose={handleClose} scroll={'paper'} aria-labelledby="form-dialog-title">
                <Form onSubmit={handleSubmit}>
                    <DialogTitle id="form-dialog-title">{t('roleManagement.roles.title')}</DialogTitle>
                    <DialogContent>
                        <div className="row p-5">
                            <div className="col-sm-12">
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    variant="standard"
                                    caption={t('roleManagement.roles.edit.form.labels.name')}
                                    className="mb-4"
                                    value={state.name}
                                    onChange={(e: any) => handleChange(e, -1)}
                                    validate={[
                                        {
                                            required: 'required',
                                            message: t('shared.required'),
                                        },
                                    ]}
                                />
                            </div>
                            <div className="col-lg-12 mt-5 ">
                                <Tabs
                                    value={tabValue}
                                    onChange={handleChangeTabs}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    className="border-bottom">
                                    {state.translations.map((item, index) => (
                                        <Tab label={`${item.language}`} key={`${index}`} {...a11yProps(`${index}`)} />
                                    ))}
                                </Tabs>
                            </div>
                            <div className="col-lg-12 mt-2 pt-5">
                                {state.translations.map((item, index) => (
                                    <TabPanel value={tabValue} index={index} key={`${index}`}>
                                        <Input
                                            id="displayText"
                                            name="displayText"
                                            type="text"
                                            variant="standard"
                                            caption={t('roleManagement.roles.edit.form.labels.displayText')}
                                            className="mb-4"
                                            value={`${item.displayText}`}
                                            onChange={(e: any) => handleChange(e, index)}
                                            multiline={true}
                                            rows={4}
                                            validate={[
                                                {
                                                    required: 'required',
                                                    message: t('shared.required'),
                                                },
                                            ]}
                                        />
                                        <Input
                                            id="description"
                                            name="description"
                                            type="text"
                                            variant="standard"
                                            caption={t('roleManagement.roles.edit.form.labels.description')}
                                            className="mb-4"
                                            value={`${item.description}`}
                                            onChange={(e: any) => handleChange(e, index)}
                                            multiline={true}
                                            rows={4}
                                            validate={[
                                                {
                                                    required: 'required',
                                                    message: t('shared.required'),
                                                },
                                            ]}
                                        />
                                    </TabPanel>
                                ))}
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            text={t('userManagement.users.edit.buttons.cancel')}
                            className={'custom-style-dialog-button-cancel'}
                            variant={'contained'}
                            onClick={() => handleClose(false)}
                        />
                        <Button
                            type="submit"
                            text={t('roleManagement.roles.edit.buttons.save')}
                            className={'custom-style-dialog-button-submit'}
                            variant={'contained'}
                        />
                    </DialogActions>
                </Form>
            </Dialog>
        </>
    );
};
export default CreateRoleComponent;
