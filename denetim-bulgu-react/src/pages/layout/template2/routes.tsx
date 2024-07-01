import React from 'react';

import { Layout2 } from '..';
import PrivateRoute from '../../../components/private-route';

const Layout2Routes = ({ component: Component, ...rest }:any) => {
    return (
        <PrivateRoute
            {...rest}
            render={props => (
                <Layout2>
                    <Component {...props} />
                </Layout2>
            )}
        />
    );
};

export default Layout2Routes;
