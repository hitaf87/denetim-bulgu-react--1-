import {
  Button,
  Form,
  Input,
  SelectUnSelect,
} from '@kocsistem/oneframe-react-bundle';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { get, put } from '../../../core/client';
import { ROLE_SETTINGS } from '../../../core/constants/apiEndpoints';

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
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

const EditRoleComponent = (props: any) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { match }: any = props;

  const initialState = {
    name: '',
    translations: [],
  };

  const [tabValue, setTabValue] = useState(0);
  const [state, setState] = useState(initialState);
  const [select, setSelect] = useState([]);
  const [selectIds, setSelectIds] = useState([]);
  const [unSelect, setUnselect] = useState([]);
  const [unSelectIds, setUnSelectIds] = useState([]);

  const [roleUsers, setRoleUsers] = useState(null);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    getAllData(match.params.roleName);
  }, []);

  const getRoleByName = async (name: string) => get<any>(`${ROLE_SETTINGS.BASE_ROUTE}${name}`);

  const getUsersByRole = async (roleName: string) =>
    get<any>(`${ROLE_SETTINGS.BASE_ROUTE}/${roleName}/users`);

  const getRoleUserInfo = async (roleName: string) =>
    get<any>(`${ROLE_SETTINGS.GET_ROLE_USER_INFO}/${roleName}`);

  const updateRole = async (values: any, roleName) =>
    put<any>(`${ROLE_SETTINGS.BASE_ROUTE}${roleName}`, values, t('shared.edit-success'));

  const getAllData = async (param: any) => {
    const roleByNameResponse = await getRoleByName(param);
    const usersByRoleResponse = await getUsersByRole(param);
    const roleUsersResponse = await getRoleUserInfo(param);

    setState(roleByNameResponse.result);
    setUsers(usersByRoleResponse.result);
    setRoleUsers(roleUsersResponse.result);
  };

  useEffect(() => {
    if (roleUsers && users) {
      setSelect(users);
      setUnselect(roleUsers.filter(x => !x.isInRole));
    }
  }, [roleUsers, users]);

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

  const onSubmit = async () => {
    const req = {
      Name: state.name,
      Translations: state.translations,
      UsersInRole: selectIds,
      UsersNotInRole: unSelectIds,
    };
    await updateRole(req, match.params.roleName);
    setTabValue(0)
    history.push('/roles');
  };

  const onTabsChanged = (event, newValue) => {
    setTabValue(newValue);
  };

  const onSelectUnSelectChanged = user => {
    const a = [];
    for (const i in user.selected) {
      a.push(user.selected[i].id);
    }
    const b = [];
    for (const i in user.unSelected) {
      b.push(user.unSelected[i].id);
    }
    setSelectIds(a);
    setUnSelectIds(b);
  };

  return (
    <>
      <div className="content ">
        <Form onSubmit={onSubmit}>
          <div className="row">
            <div className="col-sm-12">
              <div className="page-header">
                <div className="row">
                  <div className="col-sm-9">
                    <h5>
                      {t('roleManagement.roles.title')}
                    </h5>
                  </div>
                  <div className="col-sm-3 text-right">
                    <Button
                      type="submit"
                      text={t(
                        'roleManagement.roles.edit.buttons.save',
                      )}
                      className={
                        'custom-style-dialog-button-submit'
                      }
                      variant={'contained'}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row p-5">
            <div className="col-sm-12">
              <Input
                id="name"
                name="name"
                type="text"
                variant="standard"
                disabled
                caption={t(
                  'roleManagement.roles.edit.form.labels.name',
                )}
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
                onChange={onTabsChanged}
                indicatorColor="primary"
                textColor="primary"
                className="border-bottom">
                {state.translations.map((item, index) => (
                  <Tab
                    label={`${item.language}`}
                    key={`${index}`}
                    {...a11yProps(`${index}`)}
                  />
                ))}
              </Tabs>
            </div>
            <div className="col-lg-12 mt-2 pt-5">
              {state.translations.map((item, index) => (
                <TabPanel
                  value={tabValue}
                  index={index}
                  key={`${index}`}>
                  <Input
                    id="displayText"
                    name="displayText"
                    type="text"
                    variant="standard"
                    caption={t(
                      'roleManagement.roles.edit.form.labels.displayText',
                    )}
                    className="mb-4"
                    value={`${item.displayText}`}
                    onChange={(e: any) =>
                      handleChange(e, index)
                    }
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
                    caption={t(
                      'roleManagement.roles.edit.form.labels.description',
                    )}
                    className="mb-4"
                    value={`${item.description}`}
                    onChange={(e: any) =>
                      handleChange(e, index)
                    }
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
            <div className="col-lg-12 pt-5">
              <SelectUnSelect
                unselected={unSelect}
                selected={select}
                handleAction={onSelectUnSelectChanged}
                textField={'username'}
                valueField={'id'}
                displaySelectedText={t('shared.selected')}
                displayUnselectedText={t('shared.unselected')}
              />
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};
export default EditRoleComponent;
