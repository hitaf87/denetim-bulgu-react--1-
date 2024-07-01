import { Grid, Button, Input } from '@kocsistem/oneframe-react-bundle';
import { LabelDisplayedRowsArgs } from '@kocsistem/oneframe-react-bundle/bundle/lib/components/Grid/Grid';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { CallBackDialog } from '../../components';
import { del, get } from '../../core/client';
import { APPLICATION_SETTINGS_CATEGORY } from '../../core/constants/apiEndpoints';
import {
  GRID_ACTIONS_EDIT_DELETE,
  GRID_PAGE_SIZE_OPTIONS,
} from '../../core/constants';
import { GetRequestQueryString } from '../../models/shared/grid-helpers';
import CreateApplicationSettingsCategory from './create-application-category';
import EditApplicationSettingsCategory from './edit-application-category';

const ApplicationSettingCategories = () => {
  const { t } = useTranslation();

  const headCells = [
    { id: 'id', label: t('applicationSettingsCategory.grid.row.id'), sortable:true },
    { id: 'name', label: t('applicationSettingsCategory.grid.row.name'), sortable:true },
    { id: 'description',label: t('applicationSettingsCategory.grid.row.description'), sortable:true},
  ];

  const [
    applicationSettingCategories,
    setApplicationSettingCategories,
  ] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [gridSettings, setGridSettings] = useState({
    pageIndex: 0,
    pageSize: 5,
    orderBy: 'name',
    order: false,
  });
  const [searchKey, setSearchKey] = useState('');
  const [selectedValue, setSelectedValue] = useState<string>();
  const [openCallBackDialogDelete, setOpenCallBackDialogDelete] = useState(
    false,
  );
  const [open, setOpen] = useState(false);
  const [openNewRoleDialog, setOpenNewRoleDialog] = useState(false);

  const getRequestModel = () => {
    return {
      pageIndex: gridSettings.pageIndex,
      pageSize: gridSettings.pageSize,
      order: [
        {
          orderBy: gridSettings.orderBy,
          directionDesc: gridSettings.order,
        },
      ],
    };
  };
  const getAllApplicationCategories = async () => {
    const url = `${APPLICATION_SETTINGS_CATEGORY.PAGED_LIST}?${GetRequestQueryString(
      getRequestModel(),
    )}`;

    const response = await get<any>(url);
    setApplicationSettingCategories(prevState => ({
      ...prevState,
      ...response.result,
    }));
  };

  const deleteApplicationCategory = async (id: string) => {
    await del(`${APPLICATION_SETTINGS_CATEGORY.BASE_ROUTE}${id}`, t('shared.delete-success'));
    setRefresh(true);
  };

  const searchAllApplicationCategoriesByName = async () => {
    const response = await get<any>(
      `${APPLICATION_SETTINGS_CATEGORY.SEARCH}?${GetRequestQueryString(
        getRequestModel(),
      )}&Name=${searchKey}`,
    );
    setApplicationSettingCategories(prevState => ({
      ...prevState,
      ...response.result,
    }));
  };

  useEffect(() => {
    if (refresh) {
      getAllApplicationCategories();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    getAllApplicationCategories();
  }, [gridSettings]);

  useEffect(() => {
    if (searchKey && searchKey.length >= 3) {
      searchAllApplicationCategoriesByName();
    }
  }, [searchKey]);

  const handleSorting = (event: any) => {
    setGridSettings(prevState => {
      return {
        ...prevState,
        order: event.order,
        orderBy: event.orderBy,
      };
    });
  };

  const handlePagination = (event: any) => {
    setGridSettings(prevState => {
      return {
        ...prevState,
        pageIndex: event.pageNumber,
        pageSize: event.pageSize,
      };
    });
  };

  const handleBatch = (event: any) => {
    setRefresh(true);
  };

  const handleAction = (row: any, i: number) => {
    setSelectedValue(row.id);

    if (i === 1) {
      //delete
      handleClickOpenCallBackDialog(true);
    }
    if (i === 0) {
      handleClickOpen();
    }
  };

  const searchHandler = e => {
    if (e.target.value.length === 0) {
      getAllApplicationCategories();
    }
    setSearchKey(e.target.value);
  };

  const addNewApplicationCategory = () => {
    setOpenNewRoleDialog(true);
    setRefresh(false);
  };

  const handleNewClickClose = () => {
    setOpenNewRoleDialog(false);
  };

  const handleNewClickSaved = () => {
    setOpenNewRoleDialog(false);
    setRefresh(true);
  };

  const handleClickOpenCallBackDialog = value => {
    setOpenCallBackDialogDelete(true);
  };

  const handleCloseCallBackDialog = (value: boolean) => {
    setOpenCallBackDialogDelete(false);
    if (value) {
      deleteApplicationCategory(selectedValue);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  const handleClickSaved = () => {
    setOpen(false);
    setRefresh(true);
  };

  const renderPaginationInfo = (paginationInfo: LabelDisplayedRowsArgs) =>
    t('shared.pagination', { ...paginationInfo });

  return (
    <>
      <div className="content ">
        <CallBackDialog
          open={openCallBackDialogDelete}
          onClose={handleCloseCallBackDialog}
        />

        <EditApplicationSettingsCategory
          applicationSettingsCategoryById={selectedValue}
          show={open}
          saved={handleClickSaved}
          onClose={
            handleClickClose
          }></EditApplicationSettingsCategory>

        <div className="row">
          <div className="col-sm-12">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-9">
                  <h5>
                    {t('applicationSettingsCategory.title')}
                  </h5>
                </div>
                <div className="col-sm-3 text-right">
                  <Button
                    text={t(
                      'applicationSettingsCategory.add.adButton',
                    )}
                    className={'custom-style-text-button'}
                    variant={'contained'}
                    onClick={addNewApplicationCategory}
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
                              id="variantInput"
                              name="variantInput"
                              caption={t(
                                'shared.search',
                              )}
                              className={
                                'pageHeaderSearchInputSyle'
                              }
                              type="text"
                              variant="standard" // 'filled', 'outlined'
                              onChange={
                                searchHandler
                              }
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
                    dataSource={
                      applicationSettingCategories
                    }
                    orderByOption={'name'}
                    orderOption={'asc'}
                    actions={GRID_ACTIONS_EDIT_DELETE}
                    headCells={headCells}
                    sortingEvent={handleSorting}
                    paginationEvent={handlePagination}
                    batchValueEvent={handleBatch}
                    actionEvent={handleAction}
                    bacthField={'id'}
                    pageSizeOptions={GRID_PAGE_SIZE_OPTIONS}
                    labelDisplayedRows={
                      renderPaginationInfo
                    }
                    labelRowsPerPage={t(
                      'shared.rows-per-page',
                    )}
                    labelActionsText={t('shared.actions')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <CreateApplicationSettingsCategory
          show={openNewRoleDialog}
          saved={handleNewClickSaved}
          onClose={
            handleNewClickClose
          }></CreateApplicationSettingsCategory>
      </div>
    </>
  );
};

export default ApplicationSettingCategories;
