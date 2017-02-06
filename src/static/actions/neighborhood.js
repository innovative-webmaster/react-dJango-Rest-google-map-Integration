import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import {
    NEIGHBORHOOD_LIST_REQUEST,
    NEIGHBORHOOD_LIST_FAILURE,
    NEIGHBORHOOD_LIST_SUCCESS,
    NEIGHBORHOOD_LIST_RESET
} from '../constants';


export function neighborhoodListSuccess(neighborhoodList) {
    return {
        type: NEIGHBORHOOD_LIST_SUCCESS,
        payload: neighborhoodList
    };
}

export function neighborhoodListFailure(error) {
    return {
        type: NEIGHBORHOOD_LIST_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function neighborhoodListRequest() {
    return {
        type: NEIGHBORHOOD_LIST_REQUEST
    };
}

export function listNeighborhoods(token) {
    return (dispatch) => {
        dispatch(neighborhoodListRequest());
        return fetch(`${SERVER_URL}/api/v1/base/neighborhoods`, {
            method: 'get',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            },
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(neighborhoodListSuccess(response));
                } catch (e) {
                    dispatch(neighborhoodListFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(neighborhoodListFailure(error));
            });
    };
}

export function neighborhoodListReset() {
    return {
        type: NEIGHBORHOOD_LIST_RESET
    };
}

export function resetListNeighborhood() {
    return (dispatch) => {
        dispatch(neighborhoodListReset());
    }
}
