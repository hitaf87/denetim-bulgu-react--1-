import React from 'react';

import { Sidebar } from '../../../components';

const Layout2 = ({ children }:any) => {
    return (
        <>
            <div className="app-container">
                <Sidebar sideBarOpen={true} />
                <div className="app-content">
                    <div className={`page-layout`}>
                        {children ? (
                            <div className="page-layout-content">
                                {children}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
};
Layout2.displayName = 'layout2';
export default Layout2;
