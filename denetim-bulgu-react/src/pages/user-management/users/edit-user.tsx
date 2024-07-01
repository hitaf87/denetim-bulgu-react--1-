import {
  Button,
  Checkbox,
  Form,
  Input,
  SelectUnSelect,
} from '@kocsistem/oneframe-react-bundle';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { get, put } from '../../../core/client';
import { RoleAssignmentResponse } from '../../../models/claim-helper/role-assignment-response';
import {
  PagedRequestModel,
  GetRequestQueryString,
} from '../../../models/shared/grid-helpers';
import { UserGetResponse } from '../../../models/users/user-get-response';
import { UserPutRequest } from '../../../models/users/user-put-request';

import { ACCOUNT_SETTINGS,ROLE_SETTINGS } from '../../../core/constants/apiEndpoints'; 

interface Props {
  match: any;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const EditUserComponent = (props: Props) => {
  const { t } = useTranslation();
  const param = props.match.params.userName;
  const history = useHistory();

  const initialState: UserPutRequest = {
    name: '',
    surname: '',
    email: '',
    phoneNumber: 0,
    isActive: false,
    isLocked: false,
    AssignedRoles: [],
    UnassignedRoles: [],
  };

  const [state, setState] = useState<UserPutRequest>(initialState);
  const [value, setValue] = React.useState(0);
  const [unSelected, setUnSelected] = useState<Array<any>>([]);
  const [selected, setSelected] = useState<Array<any>>([]);

  const getRoleAssignments = async (userName: string) => {
    const endpoint = `${ACCOUNT_SETTINGS.GET_ROLE_ASSIGNMENTS}/${userName}`;

    return get<RoleAssignmentResponse>(endpoint);
  };

  useEffect(() => {
    (async () => {
      let rolesResponse = null;
      let roleAssignmentsResponse = null;

      if (param !== undefined) {
        await getUserById(param);
        rolesResponse = await getAllRoles();
        roleAssignmentsResponse = await getRoleAssignments(param);
      }

      if (rolesResponse && roleAssignmentsResponse) {
        const selectedRoles = [];
        const unSelectedRoles = [];
        for (const val of rolesResponse.result.items) {
          const filtered = roleAssignmentsResponse.result.filter(
            v => v.roleName === val.name,
          );

          if (filtered[0].isAssigned) {
            selectedRoles.push(val);
          } else {
            unSelectedRoles.push(val);
          }
        }
        setSelected(selectedRoles);
        setUnSelected(unSelectedRoles);
      }
    })();
  }, []);

  const getUserById = async (username: string) => {
    const url = `${ACCOUNT_SETTINGS.BASE_ROUTE}${username}`;
    const response = await get<UserGetResponse>(url);
    const result = response.result;
    const stateData: UserPutRequest = {
      name: result.name,
      surname: result.surname,
      email: result.email,
      phoneNumber: result.phoneNumber,
      isActive: result.isActive,
      isLocked: result.isLocked,
      AssignedRoles: [],
      UnassignedRoles: [],
    };
    setState(stateData);
  };

  const getAllRoles = async () => {
    const requestModel: PagedRequestModel = {
      pageIndex: 0,
      pageSize: 500,
      order: null,
    };

    const url = `${ROLE_SETTINGS.PAGED_LIST}?${GetRequestQueryString(requestModel)}`;

    return get<any>(url);
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

  const handleCheck = (e: any) => {
    setState((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleSubmit = async () => {
    const url = `${ACCOUNT_SETTINGS.BASE_ROUTE}${param}`;
    await put<any>(url, state, t('shared.edit-success'));

    history.push('/users');
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAction = role => {
    const s = state;
    const a = [];
    const b = [];
    role.selected.forEach(e => {
      a.push(e.name);
    });
    role.unSelected.forEach(e => {
      b.push(e.name);
    });
    s.AssignedRoles = [...a];
    s.UnassignedRoles = [...b];
    setState(s);
  };

  return (
    <>
      <div className="content ">
        <div className="row page-header">
          <div className="col-sm-12">
            <div className="row">
              <div className="col-sm-9">
                <h5>{t('shared.user-edit')}</h5>
              </div>
              <div className="col-sm-3 text-right">
                <Button
                  type="submit"
                  text={t('shared.submit')}
                  className={
                    'custom-style-dialog-button-submit'
                  }
                  variant={'contained'}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
        <Form onSubmit={handleSubmit}>
          <div className="row page-content">
            <div className="col-sm-12">
              <div className="form">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="row">
                      <div className="col-lg-12">
                        <Tabs
                          value={value}
                          onChange={handleTabChange}
                          aria-label="">
                          <Tab
                            label={t(
                              'userManagement.users.edit.redirect.tab.userinfomanagement',
                            )}
                            {...a11yProps(0)}
                          />
                          <Tab
                            label={t(
                              'userManagement.users.edit.redirect.tab.userrolemanagement',
                            )}
                            {...a11yProps(1)}
                          />
                        </Tabs>
                        <TabPanel
                          value={value}
                          index={0}>
                          <div className="row mt-3 p-5">
                            <div className="col-lg-12">
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
                                    value={
                                      state.name
                                    }
                                    onChange={
                                      handleChange
                                    }
                                    validate={[
                                      {
                                        required:
                                          'required',
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
                                    value={
                                      state.surname
                                    }
                                    onChange={
                                      handleChange
                                    }
                                    validate={[
                                      {
                                        required:
                                          'required',
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
                                      state.phoneNumber
                                    }
                                    onChange={
                                      handleChange
                                    }
                                    validate={[
                                      {
                                        required:
                                          'required',
                                        message: t(
                                          'shared.required',
                                        ),
                                      },
                                      {
                                        required:
                                          'number',
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
                                    disabled
                                    caption={t(
                                      'userManagement.users.edit.form.labels.email',
                                    )}
                                    className="mb-4"
                                    value={
                                      state.email
                                    }
                                    onChange={
                                      handleChange
                                    }
                                    validate={[
                                      {
                                        required:
                                          'required',
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
                                  <Checkbox
                                    id={
                                      'isActive'
                                    }
                                    name={
                                      'isActive'
                                    }
                                    label={t(
                                      'userManagement.users.edit.form.labels.isactive',
                                    )}
                                    checked={
                                      state.isActive
                                    }
                                    onChange={
                                      handleCheck
                                    }
                                  />
                                </div>
                                <div className="col-sm-6 mb-2">
                                  <Checkbox
                                    id={
                                      'isLocked'
                                    }
                                    name={
                                      'isLocked'
                                    }
                                    label={t(
                                      'userManagement.users.edit.form.labels.islock',
                                    )}
                                    checked={
                                      state.isLocked
                                    }
                                    onChange={
                                      handleCheck
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabPanel>
                        <TabPanel
                          value={value}
                          index={1}>
                          <div className="row mt-3 p-5">
                            <div className="col-lg-12">
                              <SelectUnSelect
                                unselected={
                                  unSelected
                                }
                                selected={
                                  selected
                                }
                                handleAction={
                                  handleAction
                                }
                                textField={
                                  'name'
                                }
                                valueField={
                                  'id'
                                }
                                displaySelectedText={t(
                                  'shared.selected',
                                )}
                                displayUnselectedText={t(
                                  'shared.unselected',
                                )}
                              />
                            </div>
                          </div>
                        </TabPanel>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};
export default EditUserComponent;
