import { Grid, Input,Button } from '@kocsistem/oneframe-react-bundle';
import { LabelDisplayedRowsArgs } from '@kocsistem/oneframe-react-bundle/bundle/lib/components/Grid/Grid';
import React, { useState, useEffect,useContext } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageContext from '../../language-context';
import Moment from 'moment';
import { get } from '../../core/client';
import {
  GRID_ACTIONS_DETAIL_SEND,
  GRID_PAGE_SIZE_OPTIONS,
} from '../../core/constants';
import { GetRequestQueryString } from '../../models/shared/grid-helpers';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const EmailNotifications = () => {
  const { t } = useTranslation();

  const headCells = [
    { id: 'id', label: t('report.email-notification.id')},
    { id: 'subject', label: t('report.email-notification.subject')},
    { id: 'from', label: t('report.email-notification.from')},
    { id: 'to', label: t('report.email-notification.to'), sortable:true},
    { id: 'createdDate', label: t('report.email-notification.createdDate')},
    { id: 'message', label: t('report.email-notification.isSent') },
    { id: 'sentDate', label: t('report.email-notification.sentDate') },
  ];

  const { language } = useContext(LanguageContext);
  const [ emailNotifications,setEmailNotifications] = useState(null);
  const [selectedBody, setSelectedBody] = useState<string>();
  const [selectedId, setSelectedId] = useState<string>();
  const [refresh, setRefresh] = useState(false);
  const [gridSettings, setGridSettings] = useState({
    pageIndex: 0,
    pageSize: 5,
    orderBy: 'to',
    order: false,
  });
  const [searchKey, setSearchKey] = useState('');
  const [open, setOpen] = useState(false);
  const [openSendDialog, setOpenSendDialog] = useState(false);
  

  const handleClose = (value: boolean) => {
    setOpen(value);
  };

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
  const getAllEmailNotifications = async () => {
    const url = `/email-notifications/list?${GetRequestQueryString(
      getRequestModel(),
    )}`;
    
    const response = await get<any>(url);
  
    response.result.items = prepareDataModel(response.result.items);

    setEmailNotifications(prevState => ({
      ...prevState,
      ...response.result,
    }));
  };

  const prepareDataModel = (items) => 
  {
    return items.map(item => {return {
      id: item.id,  
      subject: item.subject, 
      from: item.from,
      to: item.to,
      body: item.body,
      isSent: item.isSent,
      createdDate: Moment(item.createdDate)
                        .format('YYYY-MM-DD HH:mm:ss')
                        .toString(),
      message: item.isSent ? t('report.email-notification.success') : t('report.email-notification.notSuccess'),
      sentDate: Moment(item.sentDate)
                        .format('YYYY-MM-DD HH:mm:ss')
                        .toString(),
   }});
  }


  const searchEmailNotificationsByEmail = async () => {
    const response = await get<any>(
      `/email-notifications/search?${GetRequestQueryString(
        getRequestModel(),
      )}&Value=${searchKey}`,
    );

    response.result.items = prepareDataModel(response.result.items);
    
    setEmailNotifications(prevState => ({
      ...prevState,
      ...response.result,
    }));
  };

  useEffect(() => {
    if (refresh) {
      getAllEmailNotifications();
      setRefresh(false);
    }else if (searchKey && searchKey.length >= 3) {
      searchEmailNotificationsByEmail();
    }
    else if(searchKey.length === 0){
      getAllEmailNotifications();
    }
  }, [refresh, searchKey]);


  useEffect(() => {
    getAllEmailNotifications();
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
  
  const handleAction = (row: any, i: number) => {
      setSelectedId(row.id);
      if (i === 1) {
         setOpenSendDialog(true);
      }

      if (i === 0) {
        handleClickOpen(row.id);
      }
  };

  const handleClickOpen = (value: string) => {
    setSelectedBody(emailNotifications.items.filter(x => x.id == value)[0].body);
    setOpen(true);
  };

    const searchHandler = e => {    
        setSearchKey(e.target.value);
    };

    const sendEmailNotifications = async () => {
        const url = `/email-notifications/send/${selectedId}`;
        await get<any>(url,t('report.email-notification.success'));
    };

    const handleCloseSendDialog = (value: boolean) => {
        setOpenSendDialog(value);
    };
    const handleAcceptSendDialog = (value: boolean) => {
        sendEmailNotifications();
        setOpenSendDialog(value);
        setRefresh(true);
    };

  const renderPaginationInfo = (paginationInfo: LabelDisplayedRowsArgs) =>
    t('shared.pagination', { ...paginationInfo });

  return (
    <>
        <Dialog
            open={openSendDialog}
            onClose={handleCloseSendDialog}
            disableBackdropClick
            disableEscapeKeyDown
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description">
            <DialogTitle id="alert-dialog-slide-title">
                {t('shared.are-you-sure')}
            </DialogTitle>
            <DialogContent>
                <p>{t('shared.you-wont-be-able-to-revert-this')}</p>
            </DialogContent>
            <DialogActions>
                <Button
                    text={t('shared.cancel')}
                    className={'custom-style-dialog-button-cancel'}
                    variant={'contained'}
                    onClick={() => handleCloseSendDialog(false)}
                />
                <Button
                    type="submit"
                    text={t('shared.yes')}
                    className={'custom-style-dialog-button-submit'}
                    variant={'contained'}
                    onClick={() => handleAcceptSendDialog(false)}
                />
            </DialogActions>
        </Dialog>
       <Dialog
        open={open}
        onClose={handleClose}
        scroll={'paper'}
        aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            {t('report.email-notification.body')}
          </DialogTitle>
          <DialogContent>
            <div className="form">
              <div className="row">
                <div className="col-sm-12">
                  <div className="row">
                    <div dangerouslySetInnerHTML={{__html: selectedBody}} />
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              text={t('report.close')}
              className={'custom-style-dialog-button-cancel'}
              variant={'contained'}
              onClick={() => handleClose(false)}
            />
          </DialogActions>
      </Dialog>

      <div className="content ">
        <div className="row">
          <div className="col-sm-12">
            <div className="page-header">
              <div className="row">
                <div className="col-sm-9">
                  <h5>
                    {t('report.email-notification.title')}
                  </h5>
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
                              variant="standard"
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
                      emailNotifications
                    }
                    orderByOption={'to'}
                    orderOption={'asc'}
                    actions={GRID_ACTIONS_DETAIL_SEND}
                    headCells={headCells}
                    sortingEvent={handleSorting}
                    paginationEvent={handlePagination}
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
      </div>
    </>
  );
};

export default EmailNotifications;
