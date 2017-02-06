import { push } from 'react-router-redux';
import * as authActionCreators from '../actions/auth';

export function createReducer(initialState, reducerMap) {
    return (state = initialState, action) => {
        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(state, action.payload)
            : state;
    };
}

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    // Log the user out and bring them to the login page
    // if their token expires. 
    // This could be better. We should be pushing out a 
    // AUTH_LOGOUT_USER action
    if (response != null && response.status == 403 && response.statusText == "Forbidden") {
        localStorage.removeItem('token');
        window.location.href = "/";
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

export function parseJSON(response) {
    return response.json();
}
