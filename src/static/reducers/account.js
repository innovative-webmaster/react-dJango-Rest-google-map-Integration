import { createReducer } from '../utils';
import { 
    ACCOUNT_CREATE_USER_REQUEST, ACCOUNT_CREATE_USER_FAILURE, ACCOUNT_CREATE_USER_SUCCESS,
    ACCOUNT_CONFIRM_EMAIL_REQUEST, ACCOUNT_CONFIRM_EMAIL_FAILURE, ACCOUNT_CONFIRM_EMAIL_SUCCESS } 
from '../constants';

const initialState = {
    isConfirming: false,
    isConfirmed: false,
    isCreating: false,
    isCreated: false,
    isCreating: false,
    isCreated: false,
    isGettingUser: false,
    hasGottenUser: false,
    user: null,
    statusText: null
};

export default createReducer(initialState, {
    [ACCOUNT_CREATE_USER_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isCreating: true,
            statusText: null
        });
    },
    [ACCOUNT_CREATE_USER_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isCreating: false,
            isCreated: true,
            statusText: 'You have created an account.'
        });
    },
    [ACCOUNT_CREATE_USER_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isCreating: false,
            isCreated: false,
            statusText: `${payload.statusText}`
        });
    },
    [ACCOUNT_CONFIRM_EMAIL_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isConfirming: true,
            isConfirmed: false,
            statusText: null
        });
    },
    [ACCOUNT_CONFIRM_EMAIL_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isConfirming: false,
            isConfirmed: true,
            statusText: null
        });
    },
    [ACCOUNT_CONFIRM_EMAIL_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isConfirming: false,
            isConfirmed: false,
            statusText: `${payload.statusText}`
        });
    },
});
