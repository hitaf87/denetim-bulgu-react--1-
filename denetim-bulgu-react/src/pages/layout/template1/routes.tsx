import React from 'react';

import { Layout1 } from '..';
import PrivateRoute from '../../../components/private-route';

const Layout1Routes = ({ component: Component, ...rest }:any) => {
    return (
        <PrivateRoute
            {...rest}
            render={props => (
                <Layout1>
                    <Component {...props} />
                </Layout1>
            )}
        />
    );
};

export default Layout1Routes;
