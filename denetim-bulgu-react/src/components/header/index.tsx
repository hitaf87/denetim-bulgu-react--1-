import { Button, Select } from '@kocsistem/oneframe-react-bundle';
import React, { useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import { LOCAL_STORAGE } from '../../core/constants';
import { CONFIGURATIONS_SETTINGS } from '../../core/constants/apiEndpoints';
import { getLocalStorageItem } from '../../core/utility';
import LanguageContext from '../../language-context';
import SideNavDrawer from '../side-nav-drawer/side-nav-drawer';
import AutoLogoutListener from '../auto-logout';
import { post } from '../../core/client';

export interface HeaderProps {
  open: (value: boolean) => void;
  logo: boolean;
}

export default function PrimarySearchAppBar(props: HeaderProps): JSX.Element {
  const { open, logo } = props;
  const { t, i18n } = useTranslation();
  const history: any = useHistory();
  const { language, setLanguage } = useContext(LanguageContext);
  const [profileOpen, setProfileOpen] = useState(false);

  const fullName = getLocalStorageItem(LOCAL_STORAGE.USER_FULLNAME);
  const email = getLocalStorageItem(LOCAL_STORAGE.USER_EMAIL);
  const userFullname: string | null = fullName
    ? fullName.replace('"', '').replace('"', '')
    : '';
  const userEmail: string | null = email
    ? email.replace('"', '').replace('"', '')
    : '';


  const [autoLogoutProps, setAutoLogoutProps] = useState(null);

  const setTimeouts = async () => {
    let idleTimeout;
    let dialogTimeout;
    const idleTimeoutStorage = localStorage.getItem(LOCAL_STORAGE.AUTO_LOGOUT_IDLE_TIMEOUT);
    const dialogTimeoutStorage = localStorage.getItem(LOCAL_STORAGE.AUTO_LOGOUT_DIALOG_TIMEOUT);
    if ((idleTimeoutStorage === null || idleTimeoutStorage === "" || idleTimeoutStorage === 'undefined') || (dialogTimeoutStorage === null || dialogTimeoutStorage === "" || dialogTimeoutStorage === 'undefined')) {
      const endpoint = `${CONFIGURATIONS_SETTINGS.BASE_ROUTE}react`;
      const response = await post<any>(endpoint, [
        LOCAL_STORAGE.AUTO_LOGOUT_IDLE_TIMEOUT,
        LOCAL_STORAGE.AUTO_LOGOUT_DIALOG_TIMEOUT
      ]);

      if (response && response.isSuccessful) {
        idleTimeout = parseInt(response.result[LOCAL_STORAGE.AUTO_LOGOUT_IDLE_TIMEOUT]);
        dialogTimeout = parseInt(response.result[LOCAL_STORAGE.AUTO_LOGOUT_DIALOG_TIMEOUT]);
        localStorage.setItem(LOCAL_STORAGE.AUTO_LOGOUT_IDLE_TIMEOUT, idleTimeout);
        localStorage.setItem(LOCAL_STORAGE.AUTO_LOGOUT_DIALOG_TIMEOUT, dialogTimeout);
      }

    } else {
      idleTimeout = parseInt(idleTimeoutStorage);
      dialogTimeout = parseInt(dialogTimeoutStorage);
    }
    const data = { idleTimeout: idleTimeout, dialogTimeout: dialogTimeout };
    setAutoLogoutProps(data);
  };


  useEffect(() => {
    setTimeouts();
  }, []);

  const handleDrawerOpen = () => {
    setProfileOpen(prevValue => !prevValue);
  };
  const handleDrawerClose = () => {
    setProfileOpen(false);
  };

  const changeLanguage = (e: any) => {
    if (e.target.value) {
      setLanguage(e.target.value);
      i18n.changeLanguage(e.target.value);
    }
  };

  const handleAsideDrawerOpen = () => {
    open(true);
  };

  const data = [
    {
      Name: 'English',
      Id: 'en-US',
    },
    {
      Name: 'Türkçe',
      Id: 'tr-TR',
    },
  ];

  const renderLangMenu = () => {
    return (
      <Select
        id="lang"
        name="lang"
        caption={t('shared.language')}
        emptyValue={t('shared.select-language')}
        onChange={changeLanguage}
        className="selectLang"
        options={{
          data,
          displayField: 'Name',
          displayValue: 'Id',
          selected: language,
        }}
      />
    );
  };

  return (
    <div id="Header">
      <div className="left">
        {logo ? (
          <div className="logo">
            <img src="/src/_assets/images/logo.svg" />
          </div>
        ) : (
          <a onClick={handleAsideDrawerOpen}>
            <i
              className="flaticon-menu-button menuIcon"
              aria-hidden="true"></i>
          </a>
        )}
      </div>
      <div className="right">
        <div
          className="headerAccountContainer"
          onClick={handleDrawerOpen}>
          <div className="accountText">
            <div className="name">{userFullname[0]}</div>
          </div>
        </div>
        <div className="headerLangMenu">{renderLangMenu()}</div>
      </div>

      <SideNavDrawer
        open={profileOpen}
        onClose={handleDrawerClose}
        drawerWidth={360}
        anchor="right"
        content={
          <div className="drawerHtmlDiv">
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-auto">
                    <div className="profileImage">
                      {userFullname[0]}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="profileText">
                      <div className="row">
                        <div className="col-md-12">
                          {userFullname}
                        </div>
                        <div className="col-md-12">
                          {userEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 mt-3">
                <Button
                  type="submit"
                  fullWidth
                  className="custom-button-blue-50"
                  text={t('auth.log-out')}
                  onClick={async (e: any) => {
                    e.preventDefault();
                    window.localStorage.clear();
                    history.push('/accounts/login');
                  }}
                />
              </div>
            </div>
          </div>
        }
      />
      {autoLogoutProps && <AutoLogoutListener idleTimeout={autoLogoutProps.idleTimeout} dialogTimeout={autoLogoutProps.dialogTimeout} />}
    </div>
  );
}
