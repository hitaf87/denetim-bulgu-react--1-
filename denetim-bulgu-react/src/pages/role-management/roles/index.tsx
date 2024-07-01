import { Button } from '@kocsistem/oneframe-react-bundle';
import Grid, {
    LabelDisplayedRowsArgs,
    PaginationEventModel,
    SortingEventModel,
} from '@kocsistem/oneframe-react-bundle/bundle/lib/components/Grid/Grid';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { CallBackDialog } from '../../../components';
import { get, del } from '../../../core/client';
import { GRID_ACTIONS_EDIT_DELETE, GRID_PAGE_SIZE_OPTIONS } from '../../../core/constants';
import { ROLE_SETTINGS } from '../../../core/constants/apiEndpoints';
import { GetRequestQueryString, GridSettingsModel } from '../../../models/shared/grid-helpers';
import CreateRoleComponent from './create-role';

const RoleIndexComponent = (props: any) => {
    const { t } = useTranslation();
    const history = useHistory();

    const headCells = [
        {
            id: 'name',
            label: t('roleManagement.roles.grid.row.name'),
            sortable: true
        },
        {
            id: 'description',
            label: t('roleManagement.roles.grid.row.description')
        },
        {
            id: 'displayText',
            label: t('roleManagement.roles.grid.row.displaytext')
        },
    ];

    const [refreshRole, setRefreshRole] = useState<boolean>(false);
    const [roleGridData, setRoleGridData] = useState({});
    const [roleGridSettings, setRoleGridSettings] = useState(new GridSettingsModel(0, 5, true, headCells[0].id));
    const [openCallBackDialogDeleteRole, setOpenCallBackDialogDeleteRole] = useState(false);
    const [openCallBackDialogDeleteRoleBatch, setOpenCallBackDialogDeleteRoleBatch] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>();
    const [selectedRolesForBatch, setSelectedRolesForBatch] = useState<string[]>([]);

    const getRequestModel = () => {
        return {
            pageIndex: roleGridSettings.pageIndex,
            pageSize: roleGridSettings.pageSize,
            order: [
                {
                    orderBy: roleGridSettings.orderBy,
                    directionDesc: roleGridSettings.directionDesc,
                },
            ],
        };
    };

    const getAllRoles = async () => {
        const url = `${ROLE_SETTINGS.PAGED_LIST}?${GetRequestQueryString(getRequestModel())}`;
        const response = await get<any>(url);
        setRoleGridData(response.result);
    };

    const roleGridRefreshControl = () => {
        if (refreshRole) setRefreshRole(false);
        else setRefreshRole(true);
    };

    useEffect(() => {
        getAllRoles();
    }, [roleGridSettings, refreshRole]);

    const onRolePaginationChangedHandler = (event: PaginationEventModel) => {
        setRoleGridSettings(prevState => {
            return {
                directionDesc: prevState.directionDesc,
                orderBy: prevState.orderBy,
                pageIndex: event.pageNumber,
                pageSize: event.pageSize,
            };
        });
    };

    const onRoleSortingChangedHandler = (event: SortingEventModel) => {
        setRoleGridSettings(prevState => {
            return {
                directionDesc: event.order,
                orderBy: event.orderBy,
                pageIndex: prevState.pageIndex,
                pageSize: prevState.pageSize,
            };
        });
    };

    const gridLabelDisplayRows = (paginationInfo: LabelDisplayedRowsArgs) => t('shared.pagination', { ...paginationInfo });

    const gridBatchEventHandler = (event: any) => {
        setSelectedRolesForBatch(event);
        console.log(selectedRolesForBatch);
    };

    const gridActionEventHandler = (row: any, i: number) => {
        if (i === 0) {
            history.push('/roles/' + row.name);
        } else if (i === 1) {
            setSelectedRole(row.name);
            setOpenCallBackDialogDeleteRole(true);
        } else {
            // wrong index
        }
    };

    const closeDeleteRoleDialogHandler = async (value: boolean) => {
        if (value) {
            await del(`${ROLE_SETTINGS.BASE_ROUTE}${selectedRole}`, t('shared.delete-success'));
            roleGridRefreshControl();
        }
        setOpenCallBackDialogDeleteRole(false);
    };

    const closeBatchDeleteRoleDialogHandler = (value: boolean) => {
        setOpenCallBackDialogDeleteRoleBatch(false);
    };

    const [openCreateRoleDialog, setOpenCreateRoleDialog] = useState(false);
    const createRoleDialogOpenHandler = () => {
        setOpenCreateRoleDialog(true);
    };
    const createRoleDialogCloseHandler = () => {
        setOpenCreateRoleDialog(false);
    };
    const createRoleDialogSavedHandler = () => {
        setOpenCreateRoleDialog(false);
    };

    const refreshRoleHandler = () => {
        roleGridRefreshControl();
    };
    return (
        <>
            <div className="content ">
                <CallBackDialog open={openCallBackDialogDeleteRole} onClose={closeDeleteRoleDialogHandler} />
                <CallBackDialog open={openCallBackDialogDeleteRoleBatch} onClose={closeBatchDeleteRoleDialogHandler} />
                <CreateRoleComponent
                    show={openCreateRoleDialog}
                    saved={createRoleDialogSavedHandler}
                    onClose={createRoleDialogCloseHandler}
                    refreshData={refreshRoleHandler}></CreateRoleComponent>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="page-header">
                            <div className="row">
                                <div className="col-sm-9">
                                    <h5>{t('roleManagement.roles.title')}</h5>
                                </div>
                                <div className="col-sm-3 text-right">
                                    <Button
                                        text={t('roleManagement.roles.add.adButton')}
                                        className={'custom-style-text-button'}
                                        variant={'contained'}
                                        onClick={createRoleDialogOpenHandler}
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
                                            <div className="col-sm-12">
                                                <div className="searchBoxPageHeader"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <Grid
                                        dataSource={roleGridData}
                                        orderByOption={roleGridSettings.orderBy}
                                        orderOption={roleGridSettings.directionDesc ? 'desc' : 'asc'}
                                        actions={GRID_ACTIONS_EDIT_DELETE}
                                        headCells={headCells}
                                        bacthField={'name'}
                                        sortingEvent={e => onRoleSortingChangedHandler(e)}
                                        paginationEvent={e => onRolePaginationChangedHandler(e)}
                                        batchValueEvent={gridBatchEventHandler}
                                        actionEvent={gridActionEventHandler}
                                        pageSizeOptions={GRID_PAGE_SIZE_OPTIONS}
                                        labelDisplayedRows={gridLabelDisplayRows}
                                        labelRowsPerPage={t('shared.rows-per-page')}
                                        labelActionsText={t('shared.actions')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default RoleIndexComponent;
