import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@kocsistem/oneframe-react-bundle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { LOCAL_STORAGE } from "../../core/constants";
import { useTranslation } from 'react-i18next';

interface Props {
  idleTimeout: number,
  dialogTimeout: number
}
const AutoLogoutListener = (props: Props) => {
  const { idleTimeout, dialogTimeout } = props;
  const dialogTimeSeconds = dialogTimeout / 1000;
  const { t } = useTranslation();
  const wrapper = React.useRef(null);
  const events = ['load', 'scroll', 'mousemove', 'dblclick', 'contextmenu', 'click', 'keypress', 'pageshow', 'resize', 'focus', 'drag', 'copy', 'cut', 'paste'];
  const [remainingDialogSeconds, setStateRemainingDialogSeconds] = useState(dialogTimeSeconds);
  const [dialogShown, setStateDialogShown] = useState(false);
  const dialogShownRef = useRef(dialogShown);
  const remainingDialogSecondsRef = useRef(remainingDialogSeconds);
  const setDialogShown = data => {
    dialogShownRef.current = data;
    setStateDialogShown(data);
  }

  const setRemainingDialogSeconds = data => {
    remainingDialogSecondsRef.current = data;
    setStateRemainingDialogSeconds(data);
  }

  const reset = () => {
    if (!dialogShownRef.current) {
      localStorage.setItem(LOCAL_STORAGE.LAST_ACTIVITY_TIME, new Date().getTime().toString());
      setRemainingDialogSeconds(dialogTimeSeconds);
    }
  }

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.USER_FULLNAME);
    localStorage.removeItem(LOCAL_STORAGE.USER_EMAIL);
    localStorage.removeItem(LOCAL_STORAGE.EXPIRED_TIME);
    localStorage.setItem(LOCAL_STORAGE.AUTO_LOGOUT_EXPIRED, 'true');
    window.location.href = '/accounts/login';
  }

  const dialogCloseEvent = () => {
    setDialogShown(false);
  }

  const calculateRemainingSeconds = () => {
    return (remainingDialogSecondsRef.current * 100) / dialogTimeSeconds;
  }

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE.LAST_ACTIVITY_TIME, new Date().getTime().toString());
    localStorage.setItem(LOCAL_STORAGE.AUTO_LOGOUT_EXPIRED, 'false');
    for (const e in events) {
      window.addEventListener(events[e], reset);
    }

    return () => {
      for (const e in events) {
        window.removeEventListener(events[e], reset);
      }
    }
  }, []);

  useEffect(() => {
    let seconds = dialogTimeSeconds;
    let interval = null;
    interval = setInterval(() => {
      if (new Date().getTime() > parseInt(localStorage.getItem(LOCAL_STORAGE.LAST_ACTIVITY_TIME)) + idleTimeout) {
        if (!dialogShownRef.current) {
          seconds = dialogTimeSeconds;
          setDialogShown(true);
        }
        else {
          seconds = remainingDialogSecondsRef.current - 1;
        }
      }
      else if (localStorage.getItem(LOCAL_STORAGE.AUTO_LOGOUT_EXPIRED) === 'true') {
        logout();
      }
      else if (dialogShownRef.current) {
        setDialogShown(false);
        seconds = dialogTimeSeconds;
      }
      setRemainingDialogSeconds(seconds);
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeOut = parseInt(localStorage.getItem(LOCAL_STORAGE.LAST_ACTIVITY_TIME)) + idleTimeout + dialogTimeout;
    if (new Date().getTime() > timeOut || localStorage.getItem(LOCAL_STORAGE.AUTO_LOGOUT_EXPIRED) === 'true') {
      logout();
    }
  }, [remainingDialogSeconds]);



  return (
    <Dialog ref={wrapper}
      open={dialogShownRef.current}
      disableBackdropClick
      disableEscapeKeyDown
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle id="alert-dialog-slide-title">
        {t('autoLogout.header')}
      </DialogTitle>
      <DialogContent>
        {t('autoLogout.warning-text', { seconds: remainingDialogSecondsRef.current })}
        <div>
          <LinearProgress style={{ height: 10, margin: 5 }} variant="determinate" value={calculateRemainingSeconds()} />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          text={t('autoLogout.keep-logged-in')}
          className={'custom-style-dialog-button-cancel'}
          variant={'contained'}
          onClick={() => dialogCloseEvent()}
        />
        <Button
          text={t('autoLogout.logout')}
          className={'custom-style-dialog-button-submit'}
          variant={'contained'}
          onClick={() => logout()}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AutoLogoutListener;
