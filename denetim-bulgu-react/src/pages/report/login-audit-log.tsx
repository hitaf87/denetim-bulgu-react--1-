import { Button, DatePicker, Grid, Input } from '@kocsistem/oneframe-react-bundle';
import {
    LabelDisplayedRowsArgs,
    PaginationEventModel,
    SortingEventModel,
} from '@kocsistem/oneframe-react-bundle/bundle/lib/components/Grid/Grid';
import Moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { get, post } from '../../core/client';
import { LOGIN_AUDITLOG_SETTINGS} from '../../core/constants/apiEndpoints';
import { GRID_PAGE_SIZE_OPTIONS, GRID_ACTIONS_DELETE } from '../../core/constants';
import { FilterModel } from '../../models/report/login-audit-log';
import {
    GetRequestQueryString,
    GridSettingsModel,
} from '../../models/shared/grid-helpers';
import { ByteArrayToFileDownload } from '../../../src/core/utility/index';

const LoginAuditLogComponent = () => {
    const { t } = useTranslation();

    const headCells = [
        { id: 'id', label: '#' },
        { id: 'insertedDate', label: t('report.inserted-date'), sortable:true },
        { id: 'ip', label: t('report.ip-address'), sortable:true },
        { id: 'hostname', label: t('report.hostname'), sortable:true },
        { id: 'macAddress', label: t('report.mac-address'), sortable:true },
        { id: 'applicationUserName', label: t('report.application-username'), sortable:true },
        { id: 'osName', label: t('report.os-name'), sortable:true },
        { id: 'browserDetail', label: t('report.browser-detail'), sortable:true },
        { id: 'success', label: t('report.status') },
    ];

    const [gridData, setGridData] = useState({});
    const [gridSettings, setGridSettings] = useState(
        new GridSettingsModel(0, 5, true, headCells[1].id),
    );
    const dateNow = new Date();
    const initialFilter: FilterModel = {
        startDate: dateNow.toString(),
        endDate: dateNow.toString(),
    };


    const [filterModel, setFilterModel] = useState<FilterModel>(
         initialFilter
    );
    
    const filterModelHandleChange = (e: any) => {
        setFilterModel((prevState: any) => ({
            ...prevState,
            [e.target.name]: Moment(new Date(e.target.value)).format('yyyy-MM-DD'),
        }));
    };
    const postFilter = async () => {
        const endpoint = `${LOGIN_AUDITLOG_SETTINGS.EXCEL_EXPORT}`;
    
        const response = await post<any>(endpoint, filterModel, t("shared.save-success"));
        if(response && response.isSuccessful){
            ByteArrayToFileDownload(response);
        }
      };

    const pdfDownload = async() => {
        const endpoint = `${LOGIN_AUDITLOG_SETTINGS.PDF_EXPORT}`;

        const response = await post<any>(endpoint, filterModel, t("shared.save-success"));
        if(response && response.isSuccessful){
            ByteArrayToFileDownload(response);
        }
    }

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

    const formatResultList = (data: any) => {
        return {
            ...data,
            items: data.items.map(item => {
                return {
                    ...item,
                    insertedDate: Moment(item.insertedDate)
                        .format('YYYY-MM-DD HH:mm:ss')
                        .toString(),
                };
            }),
        };
    };
    const getList = async () => {
        const response = await get<any>(
            `${LOGIN_AUDITLOG_SETTINGS.PAGED_LIST}?${GetRequestQueryString(getRequestModel())}`,
        );
        const guzelData = formatResultList(response.result);
        setGridData(guzelData);
    };

    const searchByValue = async () => {
        const response = await get<any>(
            `${LOGIN_AUDITLOG_SETTINGS.SEARCH}?${GetRequestQueryString(
                getRequestModel(),
            )}&value=${searchKey}`,
        );
        setGridData(formatResultList(response.result));
    };

    useEffect(() => {
        if (searchKey && searchKey.length >= 3) {
            searchByValue();
        } else {
            getList();
        }
    }, [gridSettings, searchKey]);

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

    const renderPaginationInfo = (paginationInfo: LabelDisplayedRowsArgs) =>
        t('shared.pagination', { ...paginationInfo });

    return (
        <div className="row">
            <div className="col-sm">
                <div className="gridContent">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="gridSubHeader">
                                <div className="row">
                                    <div className="col-sm-2">
                                    <DatePicker
                                        fullWidth={false}
                                        id={'startDate'}
                                        name={'startDate'}
                                        caption={'Start Date'}
                                        value={filterModel.startDate}
                                        onChange={filterModelHandleChange}
                                    />
                                    </div>
                                    <div className="col-sm-2">
                                    <DatePicker
                                        fullWidth={false}
                                        id={'endDate'}
                                        name={'endDate'}
                                        caption={'End Date'}
                                        value={filterModel.endDate}
                                        onChange={filterModelHandleChange}
                                    />
                                    </div>
                                    <div className="col-sm-2 text-right">
                                    <Button
                                        type="submit"
                                        text={t('shared.excel-export')}
                                        className={'custom-style-dialog-button-submit'}
                                        variant={'contained'}
                                        onClick={postFilter}
                                    />
                                    </div>
                                    <div className="col-sm-2 text-right">
                                    <Button
                                        type="submit"
                                        text={t('shared.pdf-export')}
                                        className={'custom-style-dialog-button-submit'}
                                        variant={'contained'}
                                        onClick={pdfDownload}
                                    />
                                    </div>
                                    <div className="col-sm-4 text-right">
                                        <div className="searchBoxPageHeader">
                                            {
                                                <Input
                                                    id="txtSearch"
                                                    name="txtSearch"
                                                    caption={t('shared.search')}
                                                    className={
                                                        'pageHeaderSearchInputSyle'
                                                    }
                                                    type="text"
                                                    variant="standard" // 'filled', 'outlined'
                                                    onChange={e => {
                                                        if (
                                                            e.target.value
                                                                .length >= 3
                                                        ) {
                                                            setSearchKey(
                                                                e.target.value,
                                                            );
                                                        }

                                                        if (
                                                            e.target.value
                                                                .length === 0
                                                        ) {
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
                                orderOption={
                                    gridSettings.directionDesc ? 'desc' : 'asc'
                                }
                                headCells={headCells}
                                bacthField="id"
                                sortingEvent={e => onSortingChangedHandler(e)}
                                paginationEvent={e =>
                                    onPaginationChangedHandler(e)
                                }
                                actions={GRID_ACTIONS_DELETE}
                                pageSizeOptions={GRID_PAGE_SIZE_OPTIONS}
                                labelDisplayedRows={renderPaginationInfo}
                                labelRowsPerPage={t('shared.rows-per-page')}
                                labelActionsText ={t('shared.actions')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAuditLogComponent;
