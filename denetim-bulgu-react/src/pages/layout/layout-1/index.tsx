import React, { useState } from 'react';

import { Header, Sidebar } from '../../../components';

const Layout1 = ({ children }:any) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    const handleAside = () => {
        setSidebarOpen(prevValue => !prevValue);
    };

    return (
        <>
            <div className="app-container">
                <Sidebar sideBarOpen={sidebarOpen} />
                <div className="app-content">
                    <Header open={handleAside} logo={false} />
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
Layout1.displayName = 'layout1';
export default Layout1;
