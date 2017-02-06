import fetch from 'isomorphic-fetch';
import { push } from 'react-router-redux';
import jwtDecode from 'jwt-decode';
import { SERVER_URL } from '../utils/config';
import { checkHttpStatus, parseJSON } from '../utils';
import {
    UNIT_CREATE_REQUEST,
    UNIT_CREATE_FAILURE,
    UNIT_CREATE_SUCCESS,
    UNIT_LIST_REQUEST,
    UNIT_LIST_FAILURE,
    UNIT_LIST_SUCCESS,
    UNIT_GET_REQUEST,
    UNIT_GET_FAILURE,
    UNIT_GET_SUCCESS,
    UNIT_GET_RESET,
    UNIT_DELETE_REQUEST,
    UNIT_DELETE_FAILURE,
    UNIT_DELETE_SUCCESS,
    UNIT_DELETE_RESET,
    UNIT_EDIT_REQUEST,
    UNIT_EDIT_FAILURE,
    UNIT_EDIT_SUCCESS,
    UNIT_EDIT_RESET
} from '../constants';


export function unitCreateSuccess(unitID) {
    return {
        type: UNIT_CREATE_SUCCESS,
        payload: {
            unitID: unitID 
        }
    };
}

export function unitCreateFailure(error) {
    return {
        type: UNIT_CREATE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function unitCreateRequest() {
    return {
        type: UNIT_CREATE_REQUEST
    };
}

export function createUnit(token, number, numBeds, numBaths, leaseType, title, amenities, 
    description, contactInformation, rent, securityDeposit, buildingID, photos, 
    contactInfoName, contactInfoPhoneNumber, contactInfoSecondaryPhoneNumber, 
    contactInfoFacebook, contactInfoEmail, contactInfoWhatsapp, contactInfoRelationshipProperty,
    redirect) {
    
    // We'll build a form data object because we're packing files with it too
    var data = new FormData()
    data.append('type_lease', leaseType);
    data.append('number', number);
    data.append('num_beds', numBeds);
    data.append('num_baths', numBaths);
    data.append('title', title);
    data.append('amenities', amenities);
    data.append('description', description);
    data.append('rent', rent);
    securityDeposit != null ? data.append('security_deposit', securityDeposit) : null;
    data.append('building', buildingID);
    data.append('contact_name', contactInfoName);
    data.append('contact_phone', contactInfoPhoneNumber);
    data.append('contact_secondary_phone', contactInfoSecondaryPhoneNumber);
    data.append('contact_facebook', contactInfoFacebook);
    data.append('contact_email', contactInfoEmail);
    data.append('contact_whatsapp', contactInfoWhatsapp);
    data.append('contact_relation_property', contactInfoRelationshipProperty);

    // TODO - put these in a subarray because it
    // cpuld conflict with above keys if file
    // is named the same
    photos.map(function(s,i) {
        data.append(s.name, s);
    });

    return (dispatch) => {
        dispatch(unitCreateRequest());
        return fetch(`${SERVER_URL}/api/v1/base/units`, {
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
                    dispatch(unitCreateSuccess(response));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(unitCreateFailure({
                        response: {
                            status: 403,
                            statusText: 'Error creating unit.'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(unitCreateFailure(error));
            });
    };
}

export function unitEditSuccess(unitID) {
    return {
        type: UNIT_EDIT_SUCCESS,
        payload: {
            unitID: unitID 
        }
    };
}

export function unitEditFailure(error) {
    return {
        type: UNIT_EDIT_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function unitEditRequest() {
    return {
        type: UNIT_EDIT_REQUEST
    };
}

export function editUnit(token, unitID, number, numBeds, numBaths, leaseType, title, amenities, 
    description, contactInformation, rent, securityDeposit, buildingID, photos, existingPhotos,
    contactInfoName, contactInfoPhoneNumber, contactInfoFacebook, contactInfoEmail, contactInfoWhatsapp, contactInfoRelationshipProperty,
    redirect) {
    
    // We'll build a form data object because we're packing files with it too
    var data = new FormData()
    data.append('type_lease', leaseType);
    data.append('number', number);
    data.append('num_beds', numBeds);
    data.append('num_baths', numBaths);
    data.append('title', title);
    data.append('amenities', amenities);
    data.append('description', description);
    data.append('rent', rent);
    securityDeposit != null ? data.append('security_deposit', securityDeposit) : null;
    data.append('building', buildingID);
    data.append('contact_name', contactInfoName);
    data.append('contact_phone', contactInfoPhoneNumber);
    data.append('contact_facebook', contactInfoFacebook);
    data.append('contact_email', contactInfoEmail);
    data.append('contact_whatsapp', contactInfoWhatsapp);
    data.append('contact_relation_property', contactInfoRelationshipProperty);
    data.append('existing_photos', existingPhotos);

    // TODO - put these in a subarray because it
    // cpuld conflict with above keys if file
    // is named the same
    photos.map(function(s,i) {
        data.append(s.name, s);
    });

    return (dispatch) => {
        dispatch(unitEditRequest());
        return fetch(`${SERVER_URL}/api/v1/base/units/${unitID}`, {
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
                    dispatch(unitEditSuccess(response));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(unitEditFailure({
                        response: {
                            status: 403,
                            statusText: 'Error creating unit.'
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(unitEditFailure(error));
            });
    };
}

export function unitListSuccess(unitList) {
    return {
        type: UNIT_LIST_SUCCESS,
        payload: unitList
    };
}

export function unitListFailure(error) {
    return {
        type: UNIT_LIST_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function unitListRequest() {
    return {
        type: UNIT_LIST_REQUEST
    };
}

export function listUnits(token) {
    return (dispatch) => {
        dispatch(unitListRequest());
        return fetch(`${SERVER_URL}/api/v1/base/units`, {
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
                    dispatch(unitListSuccess(response));
                } catch (e) {
                    dispatch(unitListFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(unitListFailure(error));
            });
    };
}

export function unitGetSuccess(unitGet) {
    return {
        type: UNIT_GET_SUCCESS,
        payload: unitGet
    };
}

export function unitGetFailure(error) {
    return {
        type: UNIT_GET_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function unitGetRequest() {
    return {
        type: UNIT_GET_REQUEST
    };
}

export function unitGetReset() {
    return {
        type: UNIT_GET_RESET
    };
}

export function resetGetUnit() {
    return (dispatch) => {
        dispatch(unitGetReset());
    }
}

export function getUnit(token, unitID) {
    return (dispatch) => {
        dispatch(unitGetRequest());

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }

        if (token != null) {
            headers.Authorization = `JWT ${token}`
        }

        return fetch(`${SERVER_URL}/api/v1/base/units/${unitID}`, {
            method: 'get',
            credentials: 'include',
            headers
        })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(unitGetSuccess(response));
                } catch (e) {
                    dispatch(unitGetFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(unitGetFailure(error));
            });
    };
}

export function unitDeleteSuccess() {
    return {
        type: UNIT_DELETE_SUCCESS,
    };
}

export function unitDeleteFailure(error) {
    return {
        type: UNIT_DELETE_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText
        }
    };
}

export function unitDeleteRequest() {
    return {
        type: UNIT_DELETE_REQUEST
    };
}

export function unitDeleteReset() {
    return {
        type: UNIT_DELETE_RESET
    };
}

export function resetDeleteUnit() {
    return (dispatch) => {
        dispatch(unitDeleteReset());
    }
}

export function deleteUnit(token, unitID, redirect) {
    return (dispatch) => {
        dispatch(unitDeleteRequest());
        return fetch(`${SERVER_URL}/api/v1/base/units/${unitID}`, {
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
                    dispatch(unitDeleteSuccess(response));
                    dispatch(push(redirect));
                } catch (e) {
                    dispatch(unitDeleteFailure({
                        response: {
                            status: 403,
                            statusText: e
                        }
                    }));
                }
            })
            .catch(error => {
                dispatch(unitDeleteFailure(error));
            });
    };
}
