import React from 'react';

import { Layout3 } from '..';
import PrivateRoute from '../../../components/private-route';

const Layout3Routes = ({ component: Component, ...rest }:any) => {
    return (
        <PrivateRoute
            {...rest}
            render={props => (
                <Layout3>
                    <Component {...props} />
                </Layout3>
            )}
        />
    );
};

export default Layout3Routes;
