import { createReducer } from '../utils';
import {
    REVIEW_CREATE_REQUEST,
    REVIEW_CREATE_FAILURE,
    REVIEW_CREATE_SUCCESS
} from '../constants';
import jwtDecode from 'jwt-decode';

const initialState = {
    isCreated: false,
    reviewID: null,
    isCreating: false,
    statusText: null
};

export default createReducer(initialState, {
    [REVIEW_CREATE_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            reviewID: null,
            isCreating: true,
            statusText: null
        });
    },
    [REVIEW_CREATE_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            reviewID: payload.uuid,
            isCreating: false,
            isCreated: true,
            statusText: 'You have successfully created a review.'
        });
    },
    [REVIEW_CREATE_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            reviewID: null,
            isCreating: false,
            isCreated: false,
            statusText: `Review creation error: ${payload.statusText}`
        });
    }
});
