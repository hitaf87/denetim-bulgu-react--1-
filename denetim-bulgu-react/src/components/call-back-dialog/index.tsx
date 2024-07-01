import { Button } from '@kocsistem/oneframe-react-bundle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface SimpleDialogProps {
    open: boolean;
    onClose: (value: boolean) => void;
}

function CallBackDialog(props: SimpleDialogProps): JSX.Element {
    const { t } = useTranslation();
    const { onClose, open } = props;

    const handleClose = (value: boolean) => {
        onClose(value);
    };
    const handleAccept = (value: boolean) => {
        onClose(value);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
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
                    onClick={() => handleClose(false)}
                />
                <Button
                    type="submit"
                    text={t('shared.delete')}
                    className={'custom-style-dialog-button-submit'}
                    variant={'contained'}
                    onClick={() => handleAccept(true)}
                />
            </DialogActions>
        </Dialog>
    );
}

export default CallBackDialog;
