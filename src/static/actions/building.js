import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import {
    BUILDING_CREATE_REQUEST,
    BUILDING_CREATE_FAILURE,
    BUILDING_CREATE_SUCCESS,
    BUILDING_LIST_REQUEST,
    BUILDING_LIST_FAILURE,
    BUILDING_LIST_SUCCESS,
    BUILDING_GET_REQUEST,
    BUILDING_GET_FAILURE,
    BUILDING_GET_SUCCESS,
    BUILDING_GET_RESET,
    BUILDING_DELETE_REQUEST,
    BUILDING_DELETE_FAILURE,
    BUILDING_DELETE_SUCCESS,
    BUILDING_DELETE_RESET,
    BUILDING_EDIT_REQUEST,
    BUILDING_EDIT_FAILURE,
    BUILDING_EDIT_SUCCESS,
    BUILDING_EDIT_RESET
} from '../constants';

export function buildingCreateSuccess(buildingID) {
    return {
        type: BUILDING_CREATE_SUCCESS,
        payload: {
            buildingID: buildingID 
        }
    };
}

export function buildingCreateFailure(error) {
    return {
        type: BUILDING_CREATE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function buildingCreateRequest() {
    return {
        type: BUILDING_CREATE_REQUEST
    };
}

export function createBuilding(token, neighborhood, title, description, latitude, longitude, photos, amenities, redirect) {
    return (dispatch) => {
        dispatch(buildingCreateRequest());
        
        // We'll build a form data object because we're packing files with it too
        var data = new FormData()
        data.append('title', title);
        data.append('neighborhood', neighborhood);
        data.append('description', description);
        data.append('latitude', parseFloat(latitude).toFixed(6));
        data.append('longitude', parseFloat(longitude).toFixed(6));
        data.append('amenities', amenities);

        photos.map(function(s,i) {
            data.append(s.name, s);
        });

        return fetch(`${SERVER_URL}/api/v1/base/buildings`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                Authorization: `JWT ${token}`
            },
            body: data
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(buildingCreateSuccess(response));
                    console.log(response);
                    dispatch(push(redirect + "?buildingid=" + response.uuid + "&neighborhoodid=" + response.neighborhood));
                } catch (e) {
                    dispatch(buildingCreateFailure({
                        response: {
                            status: 403,
                            statusText: 'Error creating building.'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(buildingCreateFailure(error));
            });
    };
}

export function buildingEditSuccess(buildingID) {
    return {
        type: BUILDING_EDIT_SUCCESS,
        payload: {
            buildingID: buildingID 
        }
    };
}

export function buildingEditFailure(error) {
    return {
        type: BUILDING_EDIT_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function buildingEditRequest() {
    return {
        type: BUILDING_EDIT_REQUEST
    };
}

export function editBuilding(token, buildingID, neighborhood, title, description, latitude, longitude, photos, existingPhotos, amenities, redirect) {
    return (dispatch) => {
        dispatch(buildingEditRequest());
        
        // We'll build a form data object because we're packing files with it too
        var data = new FormData()
        data.append('title', title);
        data.append('neighborhood', neighborhood);
        data.append('description', description);
        data.append('latitude', parseFloat(latitude).toFixed(6));
        data.append('longitude', parseFloat(longitude).toFixed(6));
        data.append('amenities', amenities);
        data.append('existing_photos', existingPhotos);

        photos.map(function(s,i) {
            data.append(s.name, s);
        });

        return fetch(`${SERVER_URL}/api/v1/base/buildings/${buildingID}`, {
            method: 'put',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                Authorization: `JWT ${token}`
            },
            body: data
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(buildingEditSuccess(response));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(buildingEditFailure({
                        response: {
                            status: 403,
                            statusText: 'Error editing building.'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(buildingEditFailure(error));
            });
    };
}

export function buildingListSuccess(buildingList) {
    return {
        type: BUILDING_LIST_SUCCESS,
        payload: buildingList
    };
}

export function buildingListFailure(error) {
    return {
        type: BUILDING_LIST_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function buildingListRequest() {
    return {
        type: BUILDING_LIST_REQUEST
    };
}

export function listBuildings(token, rent=null, numBeds=null, numBaths=null) {
    let queryParams="";

    if (rent != null && numBeds != null && numBaths != null) {
        queryParams = "?rent=" + rent + "&num_beds=" + numBeds + "&num_baths=" + numBaths;
    }

    return (dispatch) => {
        dispatch(buildingListRequest());
        return fetch(`${SERVER_URL}/api/v1/base/buildings${queryParams}`, {
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
                    dispatch(buildingListSuccess(response));
                } catch (e) {
                    dispatch(buildingListFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(buildingListFailure(error));
            });
    };
}

export function buildingGetSuccess(buildingGet) {
    return {
        type: BUILDING_GET_SUCCESS,
        payload: buildingGet
    };
}

export function buildingGetFailure(error) {
    return {
        type: BUILDING_GET_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function buildingGetRequest() {
    return {
        type: BUILDING_GET_REQUEST
    };
}

export function buildingGetReset() {
    return {
        type: BUILDING_GET_RESET
    };
}

export function resetGetBuilding() {
    return (dispatch) => {
        dispatch(buildingGetReset());
    }
}

export function getBuilding(token, buildingID) {
    return (dispatch) => {
        dispatch(buildingGetRequest());

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }

        if (token != null) {
            headers.Authorization = `JWT ${token}`
        }

        return fetch(`${SERVER_URL}/api/v1/base/buildings/${buildingID}`, {
            method: 'get',
            credentials: 'include',
            headers
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(buildingGetSuccess(response));
                } catch (e) {
                    dispatch(buildingGetFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(buildingGetFailure(error));
            });
    };
}

export function buildingDeleteSuccess() {
    return {
        type: BUILDING_DELETE_SUCCESS,
    };
}

export function buildingDeleteFailure(error) {
    return {
        type: BUILDING_DELETE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function buildingDeleteRequest() {
    return {
        type: BUILDING_DELETE_REQUEST
    };
}

export function buildingDeleteReset() {
    return {
        type: BUILDING_DELETE_RESET
    };
}

export function resetDeleteBuilding() {
    return (dispatch) => {
        dispatch(buildingDeleteReset());
    }
}

export function deleteBuilding(token, buildingID, redirect) {
    return (dispatch) => {
        dispatch(buildingDeleteRequest());
        return fetch(`${SERVER_URL}/api/v1/base/buildings/${buildingID}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `JWT ${token}`
            },
        })
            .then(response => {
                try {
                    dispatch(buildingDeleteSuccess(response));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(buildingDeleteFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(buildingDeleteFailure(error));
            });
    };
}
