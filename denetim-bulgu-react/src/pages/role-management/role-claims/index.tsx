import { Treeview, Autocomplete, Button } from '@kocsistem/oneframe-react-bundle';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { get, post } from '../../../core/client';
import { ROLE_SETTINGS } from '../../../core/constants/apiEndpoints';
import { GetRequestQueryString, PagedRequestModel } from '../../../models/shared/grid-helpers';

const RoleClaimComponent = () => {
  const { t } = useTranslation();

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleClaims, setRoleClaims] = useState<any>([]);
  const [treeViewEvent, setTreeviewEvent] = useState<string>('');

  const getAllRoles = async () => {
    const requestModel: PagedRequestModel = {
      pageIndex: 0,
      pageSize: 10,
      order: null,
    };

    const endpoint = `${ROLE_SETTINGS.PAGED_LIST}?${GetRequestQueryString(requestModel)}`;

    const response = await get<any>(endpoint);
    setRoles(response.result.items);
  };

  const getRoleClaimsTree = async (role: string) => {
    const endpoint = `${ROLE_SETTINGS.GET_ROLE_CLAIMS_TREE}/${role}`;
    const response = await get<any>(endpoint);
    
    setRoleClaims(response.result);
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      getRoleClaimsTree(selectedRole);
    }
  }, [selectedRole]);

  const handleChangeClaim = async (e: any) => {
    setTreeviewEvent(e);
  };
  const postRoleClaim = async () => {
    const e = treeViewEvent;
    const postObj = {
      name: selectedRole,
      selectedRoleClaimList: e,
    };

    const endpoint = `${ROLE_SETTINGS.SAVE_ROLE_CLAIMS}`;

    await post<any>(endpoint, postObj, t("shared.save-success"));
  };

  return (
    <>
      <div className="content ">
        <div className="row">
          <div className="col-sm-12">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-9">
                  <h5>{t('roleManagement.claims.title')}</h5>
                </div>
                <div className="col-sm-3 text-right">
                  <Button
                    type="submit"
                    text={t('roleManagement.roles.edit.buttons.save')}
                    className={'custom-style-dialog-button-submit'}
                    variant={'contained'}
                    onClick={postRoleClaim}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm">
            <div className="gridContent">
              <div className="row">
                <div className="col-sm-12">
                  <div className="gridSubHeader">
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="searchBoxPageHeader">
                          <Autocomplete
                            id="autocompleteField"
                            name="autocompleteField"
                            caption={t('shared.roles')}
                            onChange={e => {
                              if (e.target && e.target.value && e.target.value !== undefined) {
                                setSelectedRole(e.target.value['name'])
                              }
                            }}
                            options={{ data: roles, displayField: 'name', displayValue: 'name', }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-sm-12">
                  {roleClaims?.length > 0 ? (
                    <Treeview
                      id="basicTreeviewRight"
                      collapseIcon={
                        <i className="fad fa-minus-square"></i>
                      }
                      expandIcon={
                        <i className="fad fa-plus-square"></i>
                      }
                      options={{ data: roleClaims }}
                      onChange={handleChangeClaim}
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleClaimComponent;
