import { Button, Form, Input } from '@kocsistem/oneframe-react-bundle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { post } from '../../../core/client';
import { UserGetResponse } from '../../../models/users/user-get-response';
import { UserPostRequest } from '../../../models/users/user-post-request';

import { ACCOUNT_SETTINGS } from '../../../core/constants/apiEndpoints'; 

export interface DialogProps {
  show: boolean;
  onClose: (value: boolean) => void;
  saved: (value: boolean) => void;
  refreshData: (value: boolean) => void;
}

const CreateUserComponent = ({ onClose, show, saved, refreshData }: DialogProps) => {
  const { t } = useTranslation();

  const formRequestState: UserPostRequest = {
    name: '',
    surname: '',
    email: '',
    phoneNumber: 0,
  };

  const [formState, setFormState] = useState<UserPostRequest>(
    formRequestState,
  );

  const handleClose = (value: boolean) => {
    onClose(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prevState: UserPostRequest) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const endpoint = `${ACCOUNT_SETTINGS.BASE_ROUTE}`;
    await post<UserGetResponse>(endpoint, formState, t("shared.save-success"));
    saved(true);
    setFormState(formRequestState);
    refreshData(true);
  };

  return (
    <>
      <Dialog
        open={show}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="form-dialog-title">
        <Form onSubmit={handleSubmit}>
          <DialogTitle id="form-dialog-title">
            {t('userManagement.users.edit.popup.title')}
          </DialogTitle>

          <DialogContent>
            <div className="form">
              <div className="row">
                <div className="col-sm-12">
                  <div className="row">
                    <div className="col-sm-6 mb-2">
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        variant="standard"
                        caption={t(
                          'userManagement.users.edit.form.labels.name',
                        )}
                        className="mb-4"
                        value={formRequestState.name}
                        onChange={handleChange}
                        validate={[
                          {
                            required: 'required',
                            message: t(
                              'shared.required',
                            ),
                          },
                        ]}
                      />
                    </div>
                    <div className="col-sm-6 mb-2">
                      <Input
                        id="surname"
                        name="surname"
                        type="text"
                        variant="standard"
                        caption={t(
                          'userManagement.users.edit.form.labels.surname',
                        )}
                        className="mb-4"
                        value={formRequestState.surname}
                        onChange={handleChange}
                        validate={[
                          {
                            required: 'required',
                            message: t(
                              'shared.required',
                            ),
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="row">
                    <div className="col-sm-6 mb-2">
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        variant="standard"
                        caption={t(
                          'userManagement.users.edit.form.labels.phonenumber',
                        )}
                        className="mb-4"
                        value={
                          formRequestState.phoneNumber
                        }
                        onChange={handleChange}
                        validate={[
                          {
                            required: 'required',
                            message: t(
                              'shared.required',
                            ),
                          },
                          {
                            required: 'number',
                            value: 10,
                            message: `${t(
                              'shared.number-required-message',
                            )} (10)`,
                          },
                        ]}
                      />
                    </div>
                    <div className="col-sm-6 mb-2">
                      <Input
                        id="email"
                        name="email"
                        type="text"
                        variant="standard"
                        caption={t(
                          'userManagement.users.edit.form.labels.email',
                        )}
                        className="mb-4"
                        value={formRequestState.email}
                        onChange={handleChange}
                        validate={[
                          {
                            required: 'required',
                            message: t(
                              'shared.required',
                            ),
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
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
              text={t('userManagement.users.edit.buttons.save')}
              className={'custom-style-dialog-button-submit'}
              variant={'contained'}
            />
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
};
export default CreateUserComponent;
