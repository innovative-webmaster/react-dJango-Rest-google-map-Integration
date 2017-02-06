import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import { 
    USER_GET_CURRENT_REQUEST, USER_GET_CURRENT_SUCCESS, USER_GET_CURRENT_FAILURE, USER_GET_CURRENT_RESET,
    USER_FAVORITE_CREATE_REQUEST, USER_FAVORITE_CREATE_SUCCESS, USER_FAVORITE_CREATE_FAILURE, USER_FAVORITE_CREATE_RESET,
    USER_FAVORITE_SHARE_REQUEST, USER_FAVORITE_SHARE_SUCCESS, USER_FAVORITE_SHARE_FAILURE, USER_FAVORITE_SHARE_RESET,
    USER_FAVORITE_DELETE_REQUEST, USER_FAVORITE_DELETE_SUCCESS, USER_FAVORITE_DELETE_FAILURE, USER_FAVORITE_DELETE_RESET,
    USER_FAVORITE_CLEAR_REQUEST, USER_FAVORITE_CLEAR_SUCCESS, USER_FAVORITE_CLEAR_FAILURE, USER_FAVORITE_CLEAR_RESET,
    USER_FAVORITE_COUNT_REQUEST, USER_FAVORITE_COUNT_SUCCESS, USER_FAVORITE_COUNT_FAILURE,
    USER_SEND_PASSWORD_RECOVERY_INSTRUCTIONS_REQUEST, USER_SEND_PASSWORD_RECOVERY_INSTRUCTIONS_SUCCESS, USER_SEND_PASSWORD_RECOVERY_INSTRUCTIONS_FAILURE, USER_SEND_PASSWORD_RECOVERY_INSTRUCTIONS_RESET,
    USER_RESET_PASSWORD_REQUEST, USER_RESET_PASSWORD_SUCCESS, USER_RESET_PASSWORD_FAILURE, USER_RESET_PASSWORD_RESET,
} from '../constants';

export function currentUserGetSuccess(user) {
    return {
        type: USER_GET_CURRENT_SUCCESS,
        payload: user
    };
}

export function currentUserGetFailure(error) {
    return {
        type: USER_GET_CURRENT_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function currentUserGetRequest() {
    return {
        type: USER_GET_CURRENT_REQUEST
    };
}

export function currentUserGetReset() {
    return {
        type: USER_GET_CURRENT_RESET
    };
}

export function resetCurrentUser() {
    return (dispatch) => {
        dispatch(currentUserGetReset());
    }
}

export function getCurrentUser(token) {
    return (dispatch) => {
        dispatch(currentUserGetRequest());
        return fetch(`${SERVER_URL}/api/v1/base/users/current`, {
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
                    dispatch(currentUserGetSuccess(response));
                } catch (e) {
                    dispatch(currentUserGetFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(currentUserGetFailure(error));
            });
    };
}

export function favoriteCreateSuccess(favoriteID) {
    return {
        type: USER_FAVORITE_CREATE_SUCCESS,
        payload: {
            favoriteID: favoriteID 
        }
    };
}

export function favoriteCreateFailure(error) {
    return {
        type: USER_FAVORITE_CREATE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function favoriteCreateRequest() {
    return {
        type: USER_FAVORITE_CREATE_REQUEST
    };
}

export function favoriteCreateReset() {
    return {
        type: USER_FAVORITE_CREATE_RESET
    };
}

export function resetCreateFavorite() {
    return (dispatch) => {
        dispatch(favoriteCreateReset());
    }
}

export function createFavorite(token, buildingID, unitID) {
    return (dispatch) => {
        dispatch(favoriteCreateRequest());
        return fetch(`${SERVER_URL}/api/v1/base/favorites`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            },
            body: JSON.stringify({
                "building": buildingID,
                "unit": unitID
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(favoriteCreateSuccess(response));
                } catch (e) {
                    dispatch(favoriteCreateFailure({
                        response: {
                            status: 403,
                            statusText: 'Error creating favorite.'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(favoriteCreateFailure(error));
            });
    };
}

export function favoriteShareSuccess() {
    return {
        type: USER_FAVORITE_SHARE_SUCCESS,
    };
}

export function favoriteShareFailure(error) {
    return {
        type: USER_FAVORITE_SHARE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function favoriteShareRequest() {
    return {
        type: USER_FAVORITE_SHARE_REQUEST
    };
}

export function favoriteShareReset() {
    return {
        type: USER_FAVORITE_SHARE_RESET
    };
}

export function resetShareFavorite() {
    return (dispatch) => {
        dispatch(favoriteShareReset());
    }
}

export function shareFavorite(token, emails) {
    return (dispatch) => {
        dispatch(favoriteShareRequest());
        return fetch(`${SERVER_URL}/api/v1/base/favorites/share`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            },
            body: JSON.stringify({
                "emails": emails,
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(favoriteShareSuccess(response));
                } catch (e) {
                    dispatch(favoriteShareFailure({
                        response: {
                            status: 403,
                            statusText: 'Error sharing favorite.'
                        }
                    }));
                }
            })
            .catch(function(errorObj) {
                return parseJSON(errorObj.response).then(
                    function (error) {
                        dispatch(favoriteShareFailure({
                            response: {
                                status: errorObj.response.status,
                                statusText: error.emails[0]
                            }
                        }));
                    })
            });
    };
}

export function favoriteDeleteSuccess() {
    return {
        type: USER_FAVORITE_DELETE_SUCCESS,
    };
}

export function favoriteDeleteFailure(error) {
    return {
        type: USER_FAVORITE_DELETE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function favoriteDeleteRequest() {
    return {
        type: USER_FAVORITE_DELETE_REQUEST
    };
}

export function favoriteDeleteReset() {
    return {
        type: USER_FAVORITE_DELETE_RESET
    };
}

export function resetDeleteFavorite() {
    return (dispatch) => {
        dispatch(favoriteDeleteReset());
    }
}

export function deleteFavorite(token, favoriteID, redirect) {
    return (dispatch) => {
        dispatch(favoriteDeleteRequest());
        return fetch(`${SERVER_URL}/api/v1/base/favorites/${favoriteID}`, {
            method: 'delete',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            },
        })
            .then(response => {
                try {
                    dispatch(favoriteDeleteSuccess(response));
                } catch (e) {
                    dispatch(favoriteDeleteFailure({
                        response: {
                            status: 403,
                            statusText: 'Error deleting favorite.'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(favoriteCreateFailure(error));
            });
    };
}

export function favoriteClearSuccess() {
    return {
        type: USER_FAVORITE_CLEAR_SUCCESS,
    };
}

export function favoriteClearFailure(error) {
    return {
        type: USER_FAVORITE_CLEAR_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function favoriteClearRequest() {
    return {
        type: USER_FAVORITE_CLEAR_REQUEST
    };
}

export function favoriteClearReset() {
    return {
        type: USER_FAVORITE_CLEAR_RESET
    };
}

export function resetClearFavorite() {
    return (dispatch) => {
        dispatch(favoriteClearReset());
    }
}

export function clearFavorites(token) {
    return (dispatch) => {
        dispatch(favoriteClearRequest());
        return fetch(`${SERVER_URL}/api/v1/base/favorites/clear`, {
            method: 'post',
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
                    dispatch(favoriteClearSuccess(response));
                } catch (e) {
                    dispatch(favoriteClearFailure({
                        response: {
                            status: 403,
                            statusText: 'Error clearing favorite.'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(favoriteCreateFailure(error));
            });
    };
}

export function favoriteCountSuccess() {
    return {
        type: USER_FAVORITE_COUNT_SUCCESS,
    };
}

export function favoriteCountFailure(error) {
    return {
        type: USER_FAVORITE_COUNT_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function favoriteCountRequest() {
    return {
        type: USER_FAVORITE_COUNT_REQUEST
    };
}

export function getFavoriteCount(token) {
    return (dispatch) => {
        dispatch(favoriteCountRequest());
        return fetch(`${SERVER_URL}/api/v1/base/user/favoritescount`, {
            method: 'post',
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
                    dispatch(favoriteCountSuccess(response));
                } catch (e) {
                    dispatch(favoriteCountFailure({
                        response: {
                            status: 403,
                            statusText: 'Error getting number of favorites.'
                        }
                    }));
                }
            })
            .catch(function(errorObj) {
                return parseJSON(errorObj.response).then(
                    function (error) {
                        dispatch(favoriteCountFailure({
                            response: {
                                status: errorObj.response.status,
                                statusText: error.emails[0]
                            }
                        }));
                    })
            });
    };
}

export function sendPasswordRecoveryInstructionsSuccess() {
    return {
        type: USER_SEND_PASSWORD_RECOVERY_INSTRUCTIONS_SUCCESS,
    };
}

export function sendPasswordRecoveryInstructionsFailure(error) {
    return {
        type: USER_SEND_PASSWORD_RECOVERY_INSTRUCTIONS_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function sendPasswordRecoveryInstructionsRequest() {
    return {
        type: USER_SEND_PASSWORD_RECOVERY_INSTRUCTIONS_REQUEST
    };
}

export function sendPasswordRecoveryInstructionsReset() {
    return {
        type: USER_SEND_PASSWORD_RECOVERY_INSTRUCTIONS_RESET
    };
}

export function resetPasswordRecoveryInstructions() {
    return (dispatch) => {
        dispatch(sendPasswordRecoveryInstructionsReset());
    }
}

export function sendPasswordRecoveryInstructions(email) {
    return (dispatch) => {
        dispatch(sendPasswordRecoveryInstructionsRequest());
        return fetch(`${SERVER_URL}/api/v1/base/users/sendpasswordrecoveryinstructions`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email": email
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(sendPasswordRecoveryInstructionsSuccess(response));
                } catch (e) {
                    dispatch(sendPasswordRecoveryInstructionsFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(function(errorObj) {
                return parseJSON(errorObj.response).then(
                    function (error) {
                        dispatch(sendPasswordRecoveryInstructionsFailure({
                            response: {
                                status: errorObj.response.status,
                                statusText: error.email[0]
                            }
                        }));
                    })
            });
    };
}

export function resetPasswordSuccess() {
    return {
        type: USER_RESET_PASSWORD_SUCCESS,
    };
}

export function resetPasswordFailure(error) {
    return {
        type: USER_RESET_PASSWORD_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function resetPasswordRequest() {
    return {
        type: USER_RESET_PASSWORD_REQUEST
    };
}

// Could be better named - fix in future
export function resetPasswordReset() {
    return {
        type: USER_RESET_PASSWORD_RESET
    };
}

export function resetPasswordResetState() {
    return (dispatch) => {
        dispatch(resetPasswordReset());
    }
}

export function resetPassword(password, code) {
    return (dispatch) => {
        dispatch(resetPasswordRequest());
        return fetch(`${SERVER_URL}/api/v1/base/users/resetpassword`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "password": password,
                "code": code
            })
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(resetPasswordSuccess(response));
                } catch (e) {
                    dispatch(resetPasswordFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(function(errorObj) {
                return parseJSON(errorObj.response).then(
                    function (error) {
                        dispatch(resetPasswordFailure({
                            response: {
                                status: errorObj.response.status,
                                statusText: error.code
                            }
                        }));
                    })
            });
    };
}
