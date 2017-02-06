import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import { REVIEW_CREATE_REQUEST, REVIEW_CREATE_SUCCESS, REVIEW_CREATE_FAILURE } from '../constants';


export function reviewCreateSuccess(reviewID) {
    return {
        type: REVIEW_CREATE_SUCCESS,
        payload: {
            reviewID: reviewID 
        }
    };
}

export function reviewCreateFailure(error) {
    return {
        type: REVIEW_CREATE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function reviewCreateRequest() {
    return {
        type: REVIEW_CREATE_REQUEST
    };
}

export function createReview(token, rating, comments, anonymous, buildingID, redirect) {
    return (dispatch) => {
        dispatch(reviewCreateRequest());
        return fetch(`${SERVER_URL}/api/v1/base/reviews`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            },
            body: JSON.stringify({
                rating, comments, anonymous,
                "building":buildingID
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(reviewCreateSuccess(response));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(reviewCreateFailure({
                        response: {
                            status: 403,
                            statusText: 'Error creating review.'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(reviewCreateFailure(error));
            });
    };
}
