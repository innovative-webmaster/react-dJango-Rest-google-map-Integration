import { createReducer } from '../utils';
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
import jwtDecode from 'jwt-decode';

const initialState = {
    isCreated: false,
    buildingID: null,
    isCreating: false,
    isGettingList: false,
    hasGottenList: false,
    buildingList: null,
    isGettingBuilding: false,
    hasGottenBuilding: false,
    isDeletingBuilding: false,
    hasDeletedBuilding: false,
    isEditingBuilding: false,
    hasEditedBuilding: false,
    building: null,
    statusText: null
};

export default createReducer(initialState, {
    [BUILDING_CREATE_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            buildingID: null,
            isCreating: true,
            isCreated: false,
            statusText: null
        });
    },
    [BUILDING_CREATE_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            buildingID: payload.uuid,
            isCreating: false,
            isCreated: true,
            statusText: 'You have successfully created a building.'
        });
    },
    [BUILDING_CREATE_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            buildingID: null,
            isCreating: false,
            isCreated: false,
            statusText: `Building creation error: ${payload.statusText}`
        });
    },
    [BUILDING_LIST_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            buildingList: null,
            isGettingList: true,
            hasGottenList: false,
            statusText: null
        });
    },
    [BUILDING_LIST_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            buildingList: payload,
            isGettingList: false,
            hasGottenList: true,
            statusText: 'List of buildings returned'
        });
    },
    [BUILDING_LIST_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            buildingList: null,
            isGettingList: false,
            hasGottenList: false,
            statusText: `Building list error: ${payload.statusText}`
        });
    },
    [BUILDING_GET_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingBuilding: true,
            hasGottenBuilding: false,
            building: null,
            statusText: null
        });
    },
    [BUILDING_GET_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingBuilding: false,
            hasGottenBuilding: true,
            building: payload,
            statusText: 'Building returned'
        });
    },
    [BUILDING_GET_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingBuilding: false,
            hasGottenBuilding: false,
            building: null,
            statusText: `Building error: ${payload.statusText}`
        });
    },
    [BUILDING_GET_RESET]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingBuilding: false,
            hasGottenBuilding: false,
            building: null,
            statusText: null
        });
    },
    [BUILDING_DELETE_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isDeletingBuilding: true,
            hasDeletedBuilding: false,
            statusText: null
        });
    },
    [BUILDING_DELETE_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isDeletingBuilding: false,
            hasDeletedBuilding: true,
            statusText: 'Building deleted'
        });
    },
    [BUILDING_DELETE_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isDeletingBuilding: false,
            hasDeletedBuilding: false,
            statusText: `Building deletion error: ${payload.statusText}`
        });
    },
    [BUILDING_DELETE_RESET]: (state, payload) => {
        return Object.assign({}, state, {
            isDeletingBuilding: false,
            hasDeletedBuilding: false,
            statusText: null
        });
    },
    [BUILDING_EDIT_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isEditingBuilding: true,
            hasEditedBuilding: false,
            statusText: null
        });
    },
    [BUILDING_EDIT_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isEditingBuilding: false,
            hasEditedBuilding: true,
            statusText: 'Building edited'
        });
    },
    [BUILDING_EDIT_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isEditingBuilding: false,
            hasEditedBuilding: false,
            statusText: `Building editing error: ${payload.statusText}`
        });
    },
    [BUILDING_EDIT_RESET]: (state, payload) => {
        return Object.assign({}, state, {
            isEditingBuilding: false,
            hasEditedBuilding: false,
            statusText: null
        });
    }
});
