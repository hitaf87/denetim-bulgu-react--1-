import { Button, Form, Input, Checkbox, Select } from '@kocsistem/oneframe-react-bundle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { get, post } from '../../core/client';
import { ApplicationSettingModel } from '../../models/application-setting';
import {  ApplicationSettingsCategory} from '../../models/application-setting-category';

export interface DialogProps {
  show: boolean;
  onClose: (value: boolean) => void;
  saved: (value: boolean) => void;
}

const CreateApplicationSettings = (props: DialogProps) => {
  const { t } = useTranslation();
  const { onClose, show, saved } = props;

  const initialState: ApplicationSettingModel = {
    key: '',
    valueType: '',
    value: '',
    categoryId: '',
    isStatic: false,
    id: '',
  };

  const [state, setState] = useState<ApplicationSettingModel>(
    initialState,
  );

  const initialApplicationCategoryState: Array<ApplicationSettingsCategory> = [];

  const [applicationCategories, setApplicationCategories] = 
        useState<Array<ApplicationSettingsCategory>>(initialApplicationCategoryState);

useEffect(() => {
  getAllCategories();
}, [show]);

  const handleClose = (value: boolean) => {
    onClose(value);
  };

  const getAllCategories = async () => {
    const response = await get<Array<ApplicationSettingsCategory>>(`/application-setting-categories`);
    setApplicationCategories(response.result);
};

  const handleChange = (e: any) => {
    setState((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const createApplicationSettings = async (
    values: ApplicationSettingModel,
  ) => {
    const endpoint = `/application-settings`;
    await post<ApplicationSettingModel>(endpoint, values, t("shared.save-success"));

    saved(true);
  };
  const handleSubmit = () => {
    createApplicationSettings(state);
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
            {t('applicationSettings.create.popup.title')}
          </DialogTitle>

          <DialogContent>
            <div className="form">
              <div className="row">
                <div className="col-sm-12">
                  <div className="row">
                    <div className="col-sm-6 mb-2">
                      <Input
                        id="key"
                        name="key"
                        type="text"
                        variant="standard"
                        caption={t(
                          'applicationSettings.create.form.labels.key',
                        )}
                        className="mb-4"
                        value={state.key}
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
                        id="valuew"
                        name="value"
                        type="text"
                        variant="standard"
                        caption={t(
                          'applicationSettings.create.form.labels.value',
                        )}
                        className="mb-4"
                        value={state.value}
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
                  <div className="row">
                    <div className="col-sm-6 mb-2">
                      <Input
                        id="valueType"
                        name="valueType"
                        type="text"
                        variant="standard"
                        caption={t(
                          'applicationSettings.create.form.labels.valueType',
                        )}
                        className="mb-4"
                        value={state.valueType}
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
                      <Select
                      id="categoryId"
                      name="categoryId"
                      className="mb-4"
                      variant="standard"
                      caption= {t('applicationSettings.create.form.labels.categoryId')}
                      emptyValue={t('applicationSettings.create.form.labels.selectItem')}
                      onChange={handleChange}
                      validate={[
                        {
                          required: 'required',
                          message: t(
                            'shared.required',
                          ),
                        },
                      ]}
                      options={{
                          data:applicationCategories,
                          displayField: 'name',
                          displayValue: 'id',
                          selected: state.categoryId,
                      }}
                  />
                    </div>
                    </div>
                    <div className="row">
                    <div className="col-sm-6 mb-2">
                      <Checkbox
                        id={'basicCheckbox'}
                        name={'basicCheckbox'}
                        label={t(
                          'applicationSettings.create.form.labels.isStatic',
                        )}
                        checked={state.isStatic}
                        onChange={handleChange}
                     />
                    </div>
                    <div className="col-sm-6 mb-2">
                      
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              text={t(
                'shared.cancel',
              )}
              className={'custom-style-dialog-button-cancel'}
              variant={'contained'}
              onClick={() => handleClose(false)}
            />
            <Button
              type="submit"
              text={t(
                'shared.save',
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
export default CreateApplicationSettings;

