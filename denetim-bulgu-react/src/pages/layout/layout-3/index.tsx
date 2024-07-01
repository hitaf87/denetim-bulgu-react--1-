import React, { memo } from 'react';

import { Header } from '../../../components';
import { sampleFunction } from '../../../core/utility';

const Layout3 = memo(({ children }: any) => {
    const handleAside = () => {
        sampleFunction();
    };
    return (
        <>
            <div className="app-container">
                <div className="app-content">
                    <Header open={handleAside} logo={true} />
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
});
Layout3.displayName = 'layout3';
export default Layout3;
