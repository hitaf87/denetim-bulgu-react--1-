import { Button, Form, Input } from '@kocsistem/oneframe-react-bundle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { get, put } from '../../core/client';
import { APPLICATION_SETTINGS_CATEGORY } from '../../core/constants/apiEndpoints';
import {
  ApplicationSettingsCategory,
  ApplicationSettingsCategoryClass,
} from '../../models/application-setting-category';

export interface DialogProps {
  show: boolean;
  onClose: (value: boolean) => void;
  saved: (value: boolean) => void;
  applicationSettingsCategoryById: any;
}

const EditApplicationSettingsCategory = (props: DialogProps) => {
  const { t } = useTranslation();
  const { onClose, show, saved, applicationSettingsCategoryById } = props;

  const initialState: ApplicationSettingsCategory = {
    id: '',
    name: '',
    description: '',
  };

  const [state, setState] = useState<ApplicationSettingsCategory>(
    initialState,
  );

  const getApplicationSettingsCategoryById = async () => {
    const response = await get<any>(
      `${APPLICATION_SETTINGS_CATEGORY.BASE_ROUTE}${applicationSettingsCategoryById}`,
    );

    const applicationSettingsCategory = new ApplicationSettingsCategoryClass(
      response.result?.id,
      response.result?.name,
      response.result?.description,
    );

    setState((prevState: ApplicationSettingsCategory) => ({
      ...prevState,
      ...applicationSettingsCategory,
    }));
  };

  const updateApplicationSettingsCategory = async (
    values: ApplicationSettingsCategory,
  ) => {
    await put<any>(`/application-setting-categories`, values, t('shared.edit-success'));
    saved(true);
  };

  useEffect(() => {
    if (applicationSettingsCategoryById !== undefined && show) {
      getApplicationSettingsCategoryById();
    }
  }, [show, applicationSettingsCategoryById]);

  const handleClose = (value: boolean) => {
    onClose(value);
  };

  const handleChange = (e: any) => {
    setState((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setState((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    updateApplicationSettingsCategory(state);
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
            {t('applicationSettingsCategory.edit.popup.title')}
          </DialogTitle>

          <DialogContent>
            <div className="form">
              <div className="row">
                <div className="col-sm-12">
                  <div className="row">
                    <div className="col-sm-12 mb-2">
                      <Input
                        disabled
                        id="id"
                        name="id"
                        type="text"
                        variant="standard"
                        caption={t(
                          'applicationSettingsCategory.edit.form.labels.id',
                        )}
                        className="mb-4"
                        value={state.id}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm-12">
                  <div className="row">
                    <div className="col-sm-6 mb-2">
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        variant="standard"
                        caption={t(
                          'applicationSettingsCategory.edit.form.labels.name',
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
                          'applicationSettingsCategory.edit.form.labels.description',
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
                'applicationSettingsCategory.edit.buttons.cancel',
              )}
              className={'custom-style-dialog-button-cancel'}
              variant={'contained'}
              onClick={() => handleClose(false)}
            />
            <Button
              type="submit"
              text={t(
                'applicationSettingsCategory.edit.buttons.save',
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
export default EditApplicationSettingsCategory;
