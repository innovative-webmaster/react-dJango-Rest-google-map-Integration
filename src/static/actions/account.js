import fetch from 'isomorphic-fetch';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import { ACCOUNT_CREATE_USER_REQUEST, ACCOUNT_CREATE_USER_FAILURE, ACCOUNT_CREATE_USER_SUCCESS,
    ACCOUNT_CONFIRM_EMAIL_FAILURE, ACCOUNT_CONFIRM_EMAIL_REQUEST, ACCOUNT_CONFIRM_EMAIL_SUCCESS }
    from '../constants';
import { authLoginUserSuccess } from './auth';
import { push } from 'react-router-redux';
import jwtDecode from 'jwt-decode';

export function accountCreateUserSuccess() {
    return {
        type: ACCOUNT_CREATE_USER_SUCCESS,
    };
}

export function accountCreateUserFailure(error) {
    return {
        type: ACCOUNT_CREATE_USER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function accountCreateUserRequest() {
    return {
        type: ACCOUNT_CREATE_USER_REQUEST
    };
}

export function accountCreateUser(firstName, lastName, email, password) {
    return (dispatch) => {
        dispatch(accountCreateUserRequest());
        return fetch(`${SERVER_URL}/api/v1/accounts/register/`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'first_name': firstName, 'last_name': lastName,
                email, password
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(accountCreateUserSuccess());
                } catch (e) {
                    dispatch(accountCreateUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Error creating account'
                        }
                    }));
                }
            })
            .catch(function(errorObj) {
                return parseJSON(errorObj.response).then(
                    function (error) {
                        dispatch(accountCreateUserFailure({
                            response: {
                                status: errorObj.response.status,
                                statusText: error.email[0]
                            }
                        }));
                    })
            });
    };
}

export function accountConfirmEmailSuccess() {
    return {
        type: ACCOUNT_CONFIRM_EMAIL_SUCCESS,
    };
}

export function accountConfirmEmailFailure(error) {
    return {
        type: ACCOUNT_CONFIRM_EMAIL_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function accountConfirmEmailRequest() {
    return {
        type: ACCOUNT_CONFIRM_EMAIL_REQUEST
    };
}

export function accountConfirmEmail(code, redirect = '/home') {
    return (dispatch) => {
        dispatch(accountConfirmEmailRequest());
        return fetch(`${SERVER_URL}/api/v1/accounts/confirm/${code}`, {
            method: 'get',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(accountConfirmEmailSuccess());
                    
                    // Validate if token is valid
                    jwtDecode(response.token);

                    dispatch(authLoginUserSuccess(response.token));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(accountConfirmEmailFailure({
                        response: {
                            status: 403,
                            statusText: 'Error confirming account'
                        }
                    }));
                }
            })
            .catch(function(errorObj) {
                return parseJSON(errorObj.response).then(
                    function (error) {
                        dispatch(accountConfirmEmailFailure({
                            response: {
                                status: errorObj.response.status,
                                statusText: error.message
                            }
                        }));
                    })
            });
    };
}
