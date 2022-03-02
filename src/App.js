import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Backdrop from './components/Backdrop/Backdrop';
import Toolbar from './components/Toolbar/Toolbar';
import MainNavigation from './components/Navigation/MainNavigation/MainNavigation';
import MobileNavigation from './components/Navigation/MobileNavigation/MobileNavigation';
import ErrorHandler from './components/ErrorHandler/ErrorHandler';
import FeedPage from './pages/Feed/Feed';
import SinglePostPage from './pages/Feed/SinglePost/SinglePost';
import LoginPage from './pages/Auth/Login';
import SignupPage from './pages/Auth/Signup';
import './App.css';

const App = ({ children, history }) => {

    const [showBackdrop, setShowBackdrop] = useState(false);
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [isAuth, setIsAuth] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [authUserId, setAuthUserId] = useState(null);
    const [authLoading, setAuthLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const expiryDate = localStorage.getItem('expiryDate');
        if (!token || !expiryDate) {
            return;
        }
        if (new Date(expiryDate) <= new Date()) {
            logoutHandler();
            return;
        }
        const userId = localStorage.getItem('userId');
        const remainingMilliseconds =
            new Date(expiryDate).getTime() - new Date().getTime();
        setAuthToken(true);
        setAuthToken(true);
        setAuthUserId(userId);
        setAutoLogout(remainingMilliseconds);

    }, []);

    const mobileNavHandler = isOpen => {
        setShowMobileNav(isOpen);
        setShowBackdrop(isOpen);
    };

    const backdropClickHandler = () => {
        setShowMobileNav(false);
        setShowBackdrop(false);
        setError(null);
    };

    const logoutHandler = () => {
        setIsAuth(false);
        setAuthToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');
    };

    const loginHandler = (event, authData) => {
        event.preventDefault();
        setAuthLoading(true);
        const graphqlQuery = {
            query: `
        query UserLogin($email: String!, $password: String!) {
            login(email: $email, password: $password) {
                token
                userId
                }
            }
        `,
            variables: {
                email: authData.email,
                password: authData.password
            }
        }
        fetch(`http://localhost:8080/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphqlQuery)
        })
            .then(res => {
                return res.json();
            })
            .then(resData => {
                if (resData.errors && resData.errors[0].status === 422) {
                    throw new Error(
                        "Validation failed. Check your password and email!"
                    );
                }
                if (resData.errors) {
                    throw new Error(
                        "User login failed!"
                    );
                }
                console.log(resData);
                setIsAuth(true);
                setAuthToken(resData.data.login.token);
                setAuthLoading(false);
                setAuthUserId(resData.data.login.userId);
                localStorage.setItem('token', resData.data.login.token);
                localStorage.setItem('userId', resData.data.login.userId);
                const remainingMilliseconds = 60 * 60 * 1000;
                const expiryDate = new Date(
                    new Date().getTime() + remainingMilliseconds
                );
                localStorage.setItem('expiryDate', expiryDate.toISOString());
                setAutoLogout(remainingMilliseconds);
            })
            .catch(err => {
                console.log(err);
                setIsAuth(false);
                setAuthLoading(false);
                setError(err);
            });
    };

    const signupHandler = (event, authData) => {
        event.preventDefault();
        setAuthLoading(true);
        const graphqlQuery = {
            query: `
                mutation CreateNewUser($email: String!, $name: String!, $password: String!) {
                    createUser(userInput: {
                    email: $email, 
                    name: $name, 
                    password: $password
                }) {
                    _id
                    email
                }
                }
            `,
            variables: {
                email: authData.email.value,
                name: authData.name.value,
                password: authData.password.value,
            }
        }
        fetch(`http://localhost:8080/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphqlQuery)
        })
            .then(res => {
                return res.json();
            })
            .then(resData => {
                if (resData.errors && resData.errors[0].status === 422) {
                    throw new Error(
                        "Validation failed. Make sure the email address isn't used yet!"
                    );
                }
                if (resData.errors) {
                    throw new Error(
                        "User creation failed!"
                    );
                }
                console.log(resData);
                setIsAuth(false);
                setAuthLoading(false);
                // history.replace('/');
            })
            .catch(err => {
                console.log(err);
                setIsAuth(false);
                setAuthLoading(false);
                setError(err);
            });
    };

    const setAutoLogout = milliseconds => {
        setTimeout(() => {
            logoutHandler();
        }, milliseconds);
    };

    const errorHandler = () => {
        setError(null);
    };

    return (
        <>
            {!isAuth ?
                <Switch>
                    <Route path="/" exact>
                        <LoginPage
                            onLogin={loginHandler}
                            loading={authLoading}
                        />
                    </Route>
                    <Route path="/signup" exact>
                        <SignupPage
                            onSignup={signupHandler}
                            loading={authLoading}
                        />
                    </Route>
                    <Redirect to="/" />
                </Switch>
                :
                <Switch>
                    <Route path="/" exact>
                        <FeedPage
                            userId={authUserId}
                            token={authToken}
                        />
                    </Route>
                    <Route path="/:postId">
                        <SinglePostPage
                            // {...props}
                            userId={authUserId}
                            token={authToken}
                        />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            }
            <React.Fragment>
                {showBackdrop && (
                    <Backdrop onClick={backdropClickHandler} />
                )}
                <ErrorHandler error={error} onHandle={errorHandler} />
                <Layout
                    header={
                        <Toolbar>
                            <MainNavigation
                                onOpenMobileNav={mobileNavHandler.bind(true)}
                                onLogout={logoutHandler}
                                isAuth={isAuth}
                            />
                        </Toolbar>
                    }
                    mobileNav={
                        <MobileNavigation
                            open={showMobileNav}
                            mobile
                            onChooseItem={mobileNavHandler.bind(false)}
                            onLogout={logoutHandler}
                            isAuth={isAuth}
                        />
                    }
                />
                {children}
            </React.Fragment>

        </>
    )
};

export default withRouter(App);
