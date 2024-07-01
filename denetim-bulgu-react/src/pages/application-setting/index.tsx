import { Grid, Input,Button,toastMessage } from '@kocsistem/oneframe-react-bundle';
import { LabelDisplayedRowsArgs } from '@kocsistem/oneframe-react-bundle/bundle/lib/components/Grid/Grid';
import React, { useState, useEffect,useContext } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageContext from '../../language-context';

import { get, del } from '../../core/client';
import {
  GRID_ACTIONS_EDIT_DELETE,
  GRID_PAGE_SIZE_OPTIONS,MESSAGE_TYPE,
} from '../../core/constants';
import { GetRequestQueryString } from '../../models/shared/grid-helpers';
import CreateApplicationSettings from './create-application-setting';
import EditApplicationSettings from './edit-application-setting';
import { CallBackDialog } from '../../components';
import { APPLICATION_SETTINGS } from '../../core/constants/apiEndpoints'; 

const ApplicationSettings = () => {
  const { t } = useTranslation();

  const headCells = [
    { id: 'id', label: t('applicationSettings.grid.row.id'), sortable:true },
    { id: 'key', label: t('applicationSettings.grid.row.key'), sortable:true },
    { id: 'value', label: t('applicationSettings.grid.row.value'), sortable:true},
    { id: 'valueType', label: t('applicationSettings.grid.row.valueType'), sortable:true },
    { id: 'status', label: t('applicationSettings.grid.row.isStatic') },
    { id: 'categoryName', label: t('applicationSettings.grid.row.categoryName') },

  ];

  const { language } = useContext(LanguageContext);
  const [ applicationSettings, setApplicationSettings] = useState([]);
  
  const [refresh, setRefresh] = useState(false);
  const [gridSettings, setGridSettings] = useState({
    pageIndex: 0,
    pageSize: 5,
    orderBy: 'key',
    order: false,
  });
  const [searchKey, setSearchKey] = useState('');
  const [openNewRoleDialog, setOpenNewRoleDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>();
  const [openCallBackDialogDelete, setOpenCallBackDialogDelete] = useState(
    false,
  );
  const [open, setOpen] = useState(false);

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
  const getAllApplicationSettings = async () => {
    const url = `${APPLICATION_SETTINGS.PAGED_LIST}?${GetRequestQueryString(getRequestModel())}`;
    
    const response = await get<any>(url);
  
    response.result.items = prepareDataModel(response.result.items);

    setApplicationSettings(prevState => ({
      ...prevState,
      ...response.result,
    }));
  };

  const prepareDataModel = (items) => 
  {
    return items.map(item => {return {
      id: item.id, 
      key: item.key,
      value: item.value,
      valueType: item.valueType,
      categoryName : item.categoryName,
      isStatic : item.isStatic,
      status : item.isStatic ? t('applicationSettings.data.static') : t('applicationSettings.data.notStatic')
   }});

  }


  const searchAllApplicationSettingsByKey = async () => {
    const response = await get<any>(
      `${APPLICATION_SETTINGS.SEARCH}?${GetRequestQueryString(
        getRequestModel(),
      )}&Key=${searchKey}`,
    );

    response.result.items = prepareDataModel(response.result.items);
    
    setApplicationSettings(prevState => ({
      ...prevState,
      ...response.result,
    }));
  };

  useEffect(() => {
    if (refresh) {
      getAllApplicationSettings();
      setRefresh(false);
    }else if (searchKey && searchKey.length >= 3) {
      searchAllApplicationSettingsByKey();
    }
    else if(searchKey.length === 0){
      getAllApplicationSettings();
    }
  }, [refresh, searchKey]);


  useEffect(() => {
    getAllApplicationSettings();
  }, [gridSettings, language]);


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
      if(!row.isStatic)
      {
        handleClickOpenCallBackDialog(true);
      } else {
        toastMessage({
          messageType: MESSAGE_TYPE.ERROR,
          title: t('applicationSettings.informationPopup.title'),
          message: t('applicationSettings.informationPopup.notDeleteStatic'),
          position: 'center',
          overlay: true,
          icon: 'flaticon-alert',
        });
      }
    }
    if (i === 0) {
      handleClickOpen();
    }
  };

  const handleClickOpenCallBackDialog = value => {
    setOpenCallBackDialogDelete(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const searchHandler = e => {    
    setSearchKey(e.target.value);
  };

  const handleNewClickClose = () => {
    setOpenNewRoleDialog(false);
  };

  const handleNewClickSaved = () => {
    setOpenNewRoleDialog(false);
    setRefresh(true);
  };

  const addNewApplicationSetting = () => {
    setOpenNewRoleDialog(true);
    setRefresh(false);
  };

  const handleCloseCallBackDialog = (value: boolean) => {
    setOpenCallBackDialogDelete(false);
    if (value) {
      deleteApplicationSetting(selectedValue);
    }
  };
  const handleClickClose = () => {
    setOpen(false);
  };
  const handleClickSaved = () => {
    setOpen(false);
    setRefresh(true);
  };
  const deleteApplicationSetting = async (id: string) => {
    await del(`${APPLICATION_SETTINGS.BASE_ROUTE}${id}`, t('shared.delete-success'));
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

      <EditApplicationSettings
          applicationSettingById={selectedValue}
          show={open}
          saved={handleClickSaved}
          onClose={
            handleClickClose
          }></EditApplicationSettings>

        <div className="row">
          <div className="col-sm-12">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-9">
                  <h5>
                    {t('applicationSettings.title')}
                  </h5>
                </div>
                <div className="col-sm-3 text-right">
                <Button
                    text={t(
                      'applicationSettings.add.adButton',
                    )}
                    className={'custom-style-text-button'}
                    variant={'contained'}
                    onClick={addNewApplicationSetting}
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
                      applicationSettings
                    }
                    orderByOption={'key'}
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
                    labelActionsText ={t('shared.actions')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <CreateApplicationSettings
          show={openNewRoleDialog}
          saved={handleNewClickSaved}
          onClose={
            handleNewClickClose
          }></CreateApplicationSettings>
      </div>
    </>
  );
};

export default ApplicationSettings;
