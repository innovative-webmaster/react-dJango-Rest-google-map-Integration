import { createReducer } from '../utils';
import {
    NEIGHBORHOOD_LIST_REQUEST,
    NEIGHBORHOOD_LIST_FAILURE,
    NEIGHBORHOOD_LIST_SUCCESS,
    NEIGHBORHOOD_LIST_RESET,
} from '../constants';
import jwtDecode from 'jwt-decode';

const initialState = {
    isGettingList: false,
    hasGottenList: false,
    neighborhoodList: null,
    statusText: null
};

export default createReducer(initialState, {
    [NEIGHBORHOOD_LIST_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            neighborhoodList: null,
            isGettingList: true,
            hasGottenList: false,
            statusText: null
        });
    },
    [NEIGHBORHOOD_LIST_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            neighborhoodList: payload,
            isGettingList: false,
            hasGottenList: true,
            statusText: 'List of neighborhoods returned'
        });
    },
    [NEIGHBORHOOD_LIST_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            neighborhoodList: null,
            isGettingList: false,
            hasGottenList: false,
            statusText: `Neighborhood list error: ${payload.statusText}`
        });
    },
    [NEIGHBORHOOD_LIST_RESET]: (state, payload) => {
        return Object.assign({}, state, {
            neighborhoodList: null,
            isGettingList: false,
            hasGottenList: false,
            statusText: null
        });
    }
});
