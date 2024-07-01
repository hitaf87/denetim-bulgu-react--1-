import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { isAllTokenInvalid } from '../../core/utility';

const renderResult = ({ component: Component, ...rest }: any): JSX.Element => {
    return (
        <Route
            {...rest}
            render={props => {
                if (!isAllTokenInvalid()) {
                    return Component ? (
                        <Component {...props} />
                    ) : (
                        rest.render(props)
                    );
                }

                return (
                    <Redirect
                        to={{
                            pathname: '/accounts/login',
                            state: {
                                from:
                                    rest.location.pathname +
                                    rest.location.search,
                            },
                        }}
                    />
                );
            }}
        />
    );
};
renderResult.displayName = 'privateRoute';
export default renderResult;
