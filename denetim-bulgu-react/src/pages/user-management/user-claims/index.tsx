import { Treeview, Autocomplete, Button } from '@kocsistem/oneframe-react-bundle';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { get, post } from '../../../core/client';
import { GetRequestQueryString } from '../../../models/shared/grid-helpers';
import { ACCOUNT_SETTINGS } from '../../../core/constants/apiEndpoints'; 
interface UserState {
    message: string;
    messageCode: string;
    messageIcon: string;
    messageType: string;
    result: {
        items: any[];
        pageIndex: number;
        pageSize: number;
        totalCount: number;
        totalPages: number;
    };
}

const initialUserState: UserState = {
    message: '',
    messageCode: '',
    messageIcon: '',
    messageType: '',
    result: {
        items: [],
        pageIndex: 0,
        pageSize: 0,
        totalCount: 0,
        totalPages: 0,
    },
};

const getPaginatedRequestModel = () => {
    return {
        pageIndex: 0,
        pageSize: 10,
        order: [
            {
                orderBy: 'username',
                directionDesc: true,
            },
        ],
    };
};

const UserClaimsComponent = () => {
    const { t } = useTranslation();

    const [users, setUsers] = useState<UserState>(initialUserState);
    const [userClaims, setUserClaims] = useState<any>([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [treeViewEvent, setTreeviewEvent] = useState<string>('');

    const getAllUsers = async () => {
        const response = await get<any>(`${ACCOUNT_SETTINGS.PAGED_LIST}?${GetRequestQueryString(getPaginatedRequestModel())}`);
        setUsers((prevState: UserState) => ({
            ...prevState,
            result: response.result,
        }));
    };

    const getUserClaimsTree = async (username: string) => {
        const endpoint = `${ACCOUNT_SETTINGS.GET_USER_CLAIMS_TREE}/${username}`;

        const response = await get<any>(endpoint);
        setUserClaims(response.result);
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            getUserClaimsTree(selectedUser);
        }
    }, [selectedUser]);

    const handleChangeClaim = async (e: any) => {
        setTreeviewEvent(e);
    };

    const postUserClaim = async () => {
        const e = treeViewEvent;
        const postObj = {
            name: selectedUser,
            selectedUserClaimList: e,
        };

        const endpoint = `${ACCOUNT_SETTINGS.SAVE_USER_CLAIMS}`;

        await post<any>(endpoint, postObj, t('shared.save-success'));
    };

    return (
        <>
            <div className="content ">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="page-header">
                            <div className="row">
                                <div className="col-sm-9">
                                    <h5>{t('userManagement.claims.title')}</h5>
                                </div>
                                <div className="col-sm-3 text-right">
                                    <Button
                                        type="submit"
                                        text={t('roleManagement.roles.edit.buttons.save')}
                                        className={'custom-style-dialog-button-submit'}
                                        variant={'contained'}
                                        onClick={postUserClaim}
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
                                                        caption={t('shared.users')}
                                                        onChange={e => {
                                                            if (e.target && e.target.value && e.target.value !== undefined) {
                                                                setSelectedUser(e.target.value['email']);
                                                            }
                                                        }}
                                                        options={{ data: users.result.items, displayField: 'email', displayValue: 'username' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    {userClaims.length ? (
                                        <Treeview
                                            id="basicTreeviewRight"
                                            collapseIcon={<i className="fad fa-minus-square"></i>}
                                            expandIcon={<i className="fad fa-plus-square"></i>}
                                            options={{ data: userClaims }}
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

export default UserClaimsComponent;
