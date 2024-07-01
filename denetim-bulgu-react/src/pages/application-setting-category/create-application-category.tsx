import { Button, Form, Input } from '@kocsistem/oneframe-react-bundle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { post } from '../../core/client';
import { ApplicationSettingsCategory } from '../../models/application-setting-category';

export interface DialogProps {
  show: boolean;
  onClose: (value: boolean) => void;
  saved: (value: boolean) => void;
}

const CreateApplicationSettingsCategory = (props: DialogProps) => {
  const { t } = useTranslation();
  const { onClose, show, saved } = props;

  const initialState: ApplicationSettingsCategory = {
    name: '',
    description: '',
    id: '',
  };

  const [state, setState] = useState<ApplicationSettingsCategory>(
    initialState,
  );

  const handleClose = (value: boolean) => {
    onClose(value);
  };

  const handleChange = (e: any) => {
    setState((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const createApplicationSettingsCategory = async (
    values: ApplicationSettingsCategory,
  ) => {
    const endpoint = `/application-setting-categories`;
    await post<any>(endpoint, values, t("shared.save-success"));

    saved(true);
  };
  const handleSubmit = () => {
    createApplicationSettingsCategory(state);
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
            {t('applicationSettingsCategory.create.popup.title')}
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
                          'applicationSettingsCategory.create.form.labels.name',
                        )}
                        className="mb-4"
                        value={state.name}
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
                        id="description"
                        name="description"
                        type="text"
                        variant="standard"
                        caption={t(
                          'applicationSettingsCategory.create.form.labels.description',
                        )}
                        className="mb-4"
                        value={state.description}
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
              text={t(
                'applicationSettingsCategory.create.buttons.cancel',
              )}
              className={'custom-style-dialog-button-cancel'}
              variant={'contained'}
              onClick={() => handleClose(false)}
            />
            <Button
              type="submit"
              text={t(
                'applicationSettingsCategory.create.buttons.save',
              )}
              className={'custom-style-dialog-button-submit'}
              variant={'contained'}
            />
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
};
export default CreateApplicationSettingsCategory;
