import { ScrollPageTop } from '@kocsistem/oneframe-react-bundle';
import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { getStoredLanguage } from './core/utility/translate';
import history from './history';
import LanguageContext from './language-context';
import ApplicationSettingCategories from './pages/application-setting-category';
import ApplicationSettings from './pages/application-setting';
import ForgotPasswordComponent from './pages/account/forgot-password';
import Login2FaComponent from './pages/account/login-2fa';
import Login from './pages/account/login';
import NewPasswordComponent from './pages/account/new-password';
import Register from './pages/account/register';
import Dashboard from './pages/dashboard';
import Template1 from './pages/layout/template1';
import Layout1Routes from './pages/layout/template1/routes';
import Template2 from './pages/layout/template2';
import Layout2Routes from './pages/layout/template2/routes';
import Template3 from './pages/layout/template3';
import Layout3Routes from './pages/layout/template3/routes';
import LoginAuditLog from './pages/report/login-audit-log';
import RoleClaims from './pages/role-management/role-claims';
import Roles from './pages/role-management/roles';
import CreateRole from './pages/role-management/roles/create-role';
import EditRole from './pages/role-management/roles/edit-role';
import UserClaims from './pages/user-management/user-claims';
import Users from './pages/user-management/users';
import EditUserComponent from './pages/user-management/users/edit-user';
import EmailNotification from './pages/report/email-notification';

const App = () => {
    const [language, setLanguage] = React.useState(getStoredLanguage());

    return (
        <>
            <LanguageContext.Provider value={{ language, setLanguage }}>
                <Router history={history}>
                    <ScrollPageTop scrollElement="root">
                        <Switch>
                            <Route exact path="/accounts/login" component={Login} />
                            <Route
                                exact
                                path="/accounts/register"
                                component={Register}
                            />
                            <Route
                                exact
                                path="/accounts/forgot-password"
                                component={ForgotPasswordComponent}
                            />
                            <Route
                                exact
                                path="/accounts/new-password"
                                component={NewPasswordComponent}
                            />
                            <Route
                                exact
                                path="/accounts/login-2fa"
                                component={Login2FaComponent}
                            />
                            <Layout1Routes
                                exact
                                path="/"
                                component={Dashboard}
                            />
                            <Layout1Routes
                                exact
                                path="/dashboard"
                                component={Dashboard}
                            />
                            <Layout1Routes
                                exact
                                path="/users"
                                component={Users}
                            />
                            <Layout1Routes
                                path="/users/user-claims"
                                component={UserClaims}
                            />
                            <Layout1Routes
                                exact
                                path="/users/:userName"
                                component={EditUserComponent}
                            />
                            <Layout1Routes
                                exact
                                path="/roles"
                                component={Roles}
                            />
                            <Layout1Routes
                                path="/roles/role-claims"
                                component={RoleClaims}
                            />
                            <Layout1Routes
                                path="/roles/new"
                                component={CreateRole}
                            />
                            <Layout1Routes
                                path="/roles/:roleName"
                                component={EditRole}
                            />
                            <Layout1Routes
                                exact
                                path="/login-audit-logs"
                                component={LoginAuditLog}
                            />
                            <Layout1Routes
                                exact
                                path="/application-setting-categories"
                                component={ApplicationSettingCategories}
                            />
                              <Layout1Routes
                                exact
                                path="/application-settings"
                                component={ApplicationSettings}
                            />
                             <Layout1Routes
                                exact
                                path="/email-notifications"
                                component={EmailNotification}
                            />

                            <Layout1Routes
                                exact
                                path="/layout/template/1"
                                component={Template1}
                            />
                            <Layout2Routes
                                exact
                                path="/layout/template/2"
                                component={Template2}
                            />
                            <Layout3Routes
                                exact
                                path="/layout/template/3"
                                component={Template3}
                            />
                        </Switch>
                    </ScrollPageTop>
                </Router>
            </LanguageContext.Provider>
        </>
    );
};

export default App;
