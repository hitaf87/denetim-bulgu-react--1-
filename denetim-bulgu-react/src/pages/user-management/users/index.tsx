import { Button, Input } from '@kocsistem/oneframe-react-bundle';
import Grid, {
    LabelDisplayedRowsArgs,
    PaginationEventModel,
    SortingEventModel,
} from '@kocsistem/oneframe-react-bundle/bundle/lib/components/Grid/Grid';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import CallBackDialog from '../../../components/call-back-dialog';
import { get, del } from '../../../core/client';
import { GRID_ACTIONS_EDIT_DELETE, GRID_PAGE_SIZE_OPTIONS } from '../../../core/constants';
import { GetRequestQueryString, GridSettingsModel } from '../../../models/shared/grid-helpers';
import { UserGetResponse } from '../../../models/users/user-get-response';
import CreateUserComponent from './create-user';

import { ACCOUNT_SETTINGS } from '../../../core/constants/apiEndpoints'; 

const UserIndexComponent = (props: any) => {
    const { t } = useTranslation();
    const history = useHistory();
    const headCells = [
        {
            id: 'username',
            label: t('userManagement.users.grid.row.username'),
            sortable: true
        },
        {
            id: 'name',
            label: t('userManagement.users.grid.row.name'),
            sortable: true
        },
        {
            id: 'surname',
            label: t('userManagement.users.grid.row.surname'),
            sortable: true
        },
        {
            id: 'email',
            label: t('userManagement.users.grid.row.email'),
            sortable: true
        },
    ];

    const [refresh, setRefresh] = useState<boolean>(false);
    const [gridData, setGridData] = useState({});
    const [gridSettings, setGridSettings] = useState(new GridSettingsModel(0, 5, true, headCells[1].id));

    const [searchKey, setSearchKey] = useState('');

    const getRequestModel = () => {
        return {
            pageIndex: gridSettings.pageIndex,
            pageSize: gridSettings.pageSize,
            order: [
                {
                    orderBy: gridSettings.orderBy,
                    directionDesc: gridSettings.directionDesc,
                },
            ],
            searchValue: searchKey,
        };
    };

    const getList = async () => {
        const response = await get<Array<UserGetResponse>>(`${ACCOUNT_SETTINGS.PAGED_LIST}?${GetRequestQueryString(getRequestModel())}`);
        setGridData(response.result);
    };

    const searchByValue = async () => {
        const response = await get<Array<UserGetResponse>>(`${ACCOUNT_SETTINGS.USER_SEARCH}?${GetRequestQueryString(getRequestModel())}&Username=${searchKey}`);
        setGridData(response.result);
    };

    const refreshControl = () => {
        if (refresh) setRefresh(false);
        else setRefresh(true);
    };

    useEffect(() => {
        if (searchKey.length >= 3) {
            searchByValue();
        } else {
            getList();
        }
    }, [gridSettings, searchKey, refresh]);

    const onPaginationChangedHandler = (event: PaginationEventModel) => {
        setGridSettings(prevState => {
            return {
                directionDesc: prevState.directionDesc,
                orderBy: prevState.orderBy,
                pageIndex: event.pageNumber,
                pageSize: event.pageSize,
            };
        });
    };

    const onSortingChangedHandler = (event: SortingEventModel) => {
        setGridSettings(prevState => {
            return {
                directionDesc: event.order,
                orderBy: event.orderBy,
                pageIndex: prevState.pageIndex,
                pageSize: prevState.pageSize,
            };
        });
    };

    const gridLabelDisplayRows = (paginationInfo: LabelDisplayedRowsArgs) => t('shared.pagination', { ...paginationInfo });

    const [selectedItem, setSelectedItem] = useState<string>();
    const [selectedItemsForBatch, setselectedItemsForBatch] = useState<string[]>([]);

    const gridActionEventHandler = (row: UserGetResponse, i: number) => {
        if (i === 0) {
            history.push('/users/' + row.username);
        } else if (i === 1) {
            setSelectedItem(row.username);
            setOpenDeleteDialog(true);
        }
    };

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openBatchDeleteDialog, setOpenBatchDeleteDialog] = useState(false);

    const gridBatchEventHandler = (event: Array<string>) => {
        setselectedItemsForBatch(event);
        console.log(selectedItemsForBatch);
    };

    const closeDeleteDialogHandler = async (value: boolean) => {
        if (value) {
            await del(`${ACCOUNT_SETTINGS.BASE_ROUTE}${selectedItem}`, t('shared.delete-success'));
            refreshControl();
        }
        setOpenDeleteDialog(false);
    };

    const closeBatchDeleteDialogHandler = (value: boolean) => {
        setOpenBatchDeleteDialog(false);
    };

    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const createDialogOpenHandler = () => {
        setOpenCreateDialog(true);
    };
    const createDialogCloseHandler = () => {
        setOpenCreateDialog(false);
    };
    const createDialogSavedHandler = () => {
        setOpenCreateDialog(false);
    };
    const refreshHandler = () => {
      refreshControl();
    };

    return (
        <>
            <div className="content ">
                <CallBackDialog open={openDeleteDialog} onClose={closeDeleteDialogHandler} />
                <CallBackDialog open={openBatchDeleteDialog} onClose={closeBatchDeleteDialogHandler} />
                <CreateUserComponent
                    show={openCreateDialog}
                    saved={createDialogSavedHandler}
                    onClose={createDialogCloseHandler}
                    refreshData={refreshHandler}></CreateUserComponent>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="page-header">
                            <div className="row">
                                <div className="col-sm-9">
                                    <h5>{t('userManagement.users.title')}</h5>
                                </div>
                                <div className="col-sm-3 text-right">
                                    <Button
                                        text={t('userManagement.users.add.adButton')}
                                        className={'custom-style-text-button'}
                                        variant={'contained'}
                                        onClick={createDialogOpenHandler}
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
                                                <div className="searchBoxPageHeader">
                                                    {
                                                        <Input
                                                            id="txtSearch"
                                                            name="txtSearch"
                                                            caption={t('shared.search')}
                                                            className={'pageHeaderSearchInputSyle'}
                                                            type="text"
                                                            variant="standard" // 'filled', 'outlined'
                                                            onChange={e => {
                                                                if (e.target.value.length >= 3) {
                                                                    setSearchKey(e.target.value);
                                                                }

                                                                if (e.target.value.length === 0) {
                                                                    setSearchKey('');
                                                                }
                                                            }}
                                                            value={searchKey}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <Grid
                                        dataSource={gridData}
                                        orderByOption={gridSettings.orderBy}
                                        orderOption={gridSettings.directionDesc ? 'desc' : 'asc'}
                                        headCells={headCells}
                                        bacthField="username"
                                        sortingEvent={e => onSortingChangedHandler(e)}
                                        paginationEvent={e => onPaginationChangedHandler(e)}
                                        actions={GRID_ACTIONS_EDIT_DELETE}
                                        actionEvent={gridActionEventHandler}
                                        batchValueEvent={gridBatchEventHandler}
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

export default UserIndexComponent;
