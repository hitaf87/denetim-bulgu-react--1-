import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

import packageJson from '../../../package.json';
import logo from '../../_assets/images/logo.svg';
import { get } from '../../core/client';
import { useElement } from '../../core/hooks';
import LanguageContext from '../../language-context';
import SidebarItem from './sidebar-item';

interface Props {
    children?: any;
    menu?: any;
    sideBarOpen: boolean;
}

const Sidebar = (props: Props) => {
    const { sideBarOpen } = props;

    const history: any = useHistory();
    const { language } = useContext(LanguageContext);
    const { t } = useTranslation();

    const [menus, setMenus] = useState([]);
    const [sidebarEl] = useElement(() => document.querySelector('body'));
    const [sidebarMobileOpen, setSidebarMobile] = useState<boolean>(true);
    const [sidebarMenuLarge, setSidebarMenuLarge] = useState(true);
    const [toggleButton] = useState(
        process.env.REACT_APP_SIDEBAR_TOGGLE_BUTTON === 'true',
    );
    const [mobileToggleLarge] = useState(
        process.env.REACT_APP_SIDEBAR_MOBILE_TOGGLE_SIZE === 'true',
    );
    const [urlState, setUrlState] = useState('');

    const getMenuData = async () => {
        const menuResponse = await get<any>('/menu');
        setMenus(menuResponse.result);
    };

    useEffect(() => {
        getMenuData();
    }, [language]);

    useEffect(() => {
        setUrlState(history.location.pathname);
    }, [history.location.pathname]);

    useEffect(() => {
        if (sidebarEl && sidebarEl.clientWidth < 540 && !mobileToggleLarge) {
            setSidebarMenuLarge(false);
        }
    }, [sidebarEl, mobileToggleLarge]);

    useEffect(() => {
        setSidebarMenuLarge(sideBarOpen);
    }, [sideBarOpen]);

    const sidebarLargeToggle = () => {
        setSidebarMenuLarge(!sidebarMenuLarge);

        const e = document.querySelectorAll<HTMLElement>('#childMenuContainer');
        for (let i = 0; i < e.length; i++) {
            e[i].classList.toggle('isDisplay');
        }
    };

    return (
        <>
            <aside className={`${sidebarMenuLarge ? 'opened' : 'closed'}`}>
                <div
                    id="sidebar"
                    className={`sidebar ${
                        sidebarMenuLarge ? 'sidebar-open' : 'sidebar-close'
                    }`}>
                    <div className="aside-top">
                        <div
                            className="menu-icon"
                            style={{ display: toggleButton ? 'flex' : 'none' }}>
                            <div className="logo">
                                <img src={logo} />
                            </div>
                            {!sidebarMobileOpen ? (
                                !sidebarMenuLarge ? (
                                    <div
                                        className="icon"
                                        onClick={() => sidebarLargeToggle()}>
                                        <NavigateNextIcon />
                                    </div>
                                ) : (
                                    <div
                                        className="icon"
                                        onClick={() => sidebarLargeToggle()}>
                                        <NavigateBeforeIcon />
                                    </div>
                                )
                            ) : (
                                <div
                                    className="icon"
                                    onClick={() => setSidebarMobile(false)}>
                                    <NavigateBeforeIcon />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="aside-content">
                        <List disablePadding dense>
                            {menus.map((sidebarItem, index) => (
                                <React.Fragment key={`${sidebarItem}${index}`}>
                                    {sidebarItem.name === 'divider' ? (
                                        <Divider style={{ margin: '6px 0' }} />
                                    ) : (
                                        <SidebarItem
                                            item={sidebarItem}
                                            urls={urlState}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </List>
                    </div>
                    <div className="versionColor">
                        {' '}
                        {t('shared.version')} {packageJson.version}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
