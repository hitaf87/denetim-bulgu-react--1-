import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
    sidebarMenu?: boolean;
    item?: any;
    depthStep?: number;
    depth?: number;
    urls: string;
}
const SidebarItem = ((props: Props) => {
    // props
    const { sidebarMenu, item, depthStep, depth, urls } = props;
    const { url, children, icon, onClickProp, name } = item;

    //state
    const [collapsed, setCollapsed] = useState(sidebarMenu);
    const [urlState, setUrlState] = useState('');
    const [isActive, setIsActive] = useState('');
    useEffect(() => {
        setUrlState(urls);
    }, [urls]);

    useEffect(() => {
        recursiveChild(item, urlState);
    }, [urlState]);

    const recursiveChild = (items: any, urlString: string) => {
        if (
            Array.isArray(items.children) &&
            items.children.length > 0 &&
            items.children !== undefined
        ) {
            for (const i in items.children) {
                if (
                    Array.isArray(items.children[i].children) &&
                    items.children[i].children.length > 0 &&
                    items.children[i].children !== undefined
                ) {
                    recursiveChild(items.children[i], urlString);
                } else if (items?.children[i]?.url === urlString) {
                    setIsActive('is-active');
                    setCollapsed(true);
                    return;
                }
                setIsActive('');
            }
        } else if (items?.url === urlString) {
            setIsActive('is-active');
            setCollapsed(true);
        } else {
            setIsActive('');
        }
    };

    function toggleCollapse() {
        setCollapsed(prevValue => !prevValue);
    }

    function onClick(e: any) {
        if (Array.isArray(children)) {
            toggleCollapse();
        }
        if (onClickProp) {
            onClickProp(e, item);
        }
    }

    // Menu icon
    let expandIcon;
    if (Array.isArray(children) && children.length) {
        expandIcon = !collapsed ? (
            <NavigateNextIcon />
        ) : (
            <KeyboardArrowDownIcon />
        );
    }

    return (
        <>
            <div className={`${!collapsed ? 'menu-close' : 'menu-open'}`}>
                <ListItem
                    className={`${
                        !children || children.length === 0
                            ? 'sidebar-item ' + isActive
                            : 'sidebar-item-expanded ' + isActive
                    }`}
                    onClick={onClick}
                    button
                    dense
                    {...item}>
                    {!children || children.length === 0 ? (
                        <NavLink exact={true} activeClassName="" to={url}>
                            <div style={{ paddingLeft: depth * depthStep }}>
                                <div className="icon">
                                    {icon && (
                                        <i
                                            className={icon}
                                            aria-hidden="true"></i>
                                    )}
                                </div>
                                <div className="link">{name}</div>
                            </div>
                        </NavLink>
                    ) : (
                        <div style={{ paddingLeft: depth * depthStep }}>
                            <div className="icon">
                                {icon && (
                                    <i className={icon} aria-hidden="true"></i>
                                )}
                            </div>
                            <div className="link">{name}</div>
                            <div className="arrow">{expandIcon}</div>
                        </div>
                    )}
                </ListItem>
                <div id="childMenuContainer">
                    <Collapse in={collapsed} timeout="auto" unmountOnExit>
                        {Array.isArray(children) && children.length > 0 ? (
                            <List disablePadding dense>
                                {children.map((subItem, index) => (
                                    <React.Fragment
                                        key={`${subItem.id}${index}`}>
                                        {subItem === 'divider' ? (
                                            <Divider
                                                style={{ margin: '6px 0' }}
                                            />
                                        ) : (
                                            <SidebarItem
                                                item={subItem}
                                                sidebarMenu={sidebarMenu}
                                                urls={urls}
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : null}
                    </Collapse>
                </div>
            </div>
        </>
    );
});
export default SidebarItem;
