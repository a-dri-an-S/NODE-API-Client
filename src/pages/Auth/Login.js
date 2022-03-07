import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Input from '../../components/Form/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';

const Login = ({ loading, onLogin }) => {
    const [loginForm, setLoginForm] = useState({
        email: {
            value: '',
            valid: false,
            touched: false,
            validators: [required, email]
        },
        password: {
            value: '',
            valid: false,
            touched: false,
            validators: [required, length({ min: 5 })]
        },
        formIsValid: false
    });

    const inputChangeHandler = (input, value) => {
        setLoginForm(prevState => {
            let isValid = true;
            for (const validator of prevState[input].validators) {
                isValid = isValid && validator(value);
            }
            const updatedForm = {
                ...prevState,
                [input]: {
                    ...prevState[input],
                    valid: isValid,
                    value: value
                }
            };
            let formIsValid = true;
            for (const inputName in updatedForm) {
                if (inputName === 'email' || inputName === 'password') {
                    formIsValid = formIsValid && updatedForm[inputName].valid;
                }
            }
            return {
                ...updatedForm,
                formIsValid: formIsValid
            };
        });
    };

    const inputBlurHandler = input => {
        setLoginForm(prevState => {
            return {
                ...prevState,
                [input]: {
                    ...prevState[input],
                    touched: true
                }
            };
        });
    };

    return (
        <Auth>
            <form
                onSubmit={e =>
                    onLogin(e, {
                        email: loginForm.email.value,
                        password: loginForm.password.value
                    })
                }
            >
                <Input
                    id="email"
                    label="Your E-Mail"
                    type="email"
                    control="input"
                    onChange={inputChangeHandler}
                    onBlur={() => inputBlurHandler('email')}
                    value={loginForm.email.value}
                    valid={loginForm.email.valid}
                    touched={loginForm.email.touched}
                />
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    control="input"
                    onChange={inputChangeHandler}
                    onBlur={() => inputBlurHandler('password')}
                    value={loginForm.password.value}
                    valid={loginForm.password.valid}
                    touched={loginForm.password.touched}
                />
                <Button design="raised" type="submit" loading={loading}>
                    Login
                </Button>
            </form>
        </Auth>
    );
};

Login.propTypes = {
    loading: PropTypes.bool,
    isLogin: PropTypes.func
};

export default Login;
