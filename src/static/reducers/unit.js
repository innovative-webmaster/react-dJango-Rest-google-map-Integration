import { createReducer } from '../utils';
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
import jwtDecode from 'jwt-decode';

const initialState = {
    isCreated: false,
    unitID: null,
    isCreating: false,
    statusText: null,
    unitList: null,
    isGettingList: false,
    hasGottenList: false,
    isGettingUnit: false,
    hasGottenUnit: false,
    isDeletingUnit: false,
    hasDeletedUnit: false,
    isEditingUnit: false,
    hasEditedUnit: false,
    unit: null
};

export default createReducer(initialState, {
    [UNIT_CREATE_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            unitID: null,
            isCreating: true,
            statusText: null
        });
    },
    [UNIT_CREATE_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            unitID: payload.uuid,
            isCreating: false,
            isCreated: true,
            statusText: 'You have successfully created a unit.'
        });
    },
    [UNIT_CREATE_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            unitID: null,
            isCreating: false,
            isCreated: false,
            statusText: `Unit creation error: ${payload.statusText}`
        });
    },
    [UNIT_LIST_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            unitList: null,
            isGettingList: true,
            hasGottenList: false,
            statusText: null
        });
    },
    [UNIT_LIST_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            unitList: payload,
            isGettingList: false,
            hasGottenList: true,
            statusText: 'List of units returned'
        });
    },
    [UNIT_LIST_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            unitList: null,
            isGettingList: false,
            hasGottenList: false,
            statusText: `Unit list error: ${payload.statusText}`
        });
    },
    [UNIT_GET_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingUnit: true,
            hasGottenUnit: false,
            unit: null,
            statusText: null
        });
    },
    [UNIT_GET_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingUnit: false,
            hasGottenUnit: true,
            unit: payload,
            statusText: 'Unit returned'
        });
    },
    [UNIT_GET_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingUnit: false,
            hasGottenUnit: false,
            unit: null,
            statusText: `Unit error: ${payload.statusText}`
        });
    },
    [UNIT_GET_RESET]: (state, payload) => {
        return Object.assign({}, state, {
            isGettingUnit: false,
            hasGottenUnit: false,
            unit: null,
            statusText: null
        });
    },
    [UNIT_DELETE_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isDeletingUnit: true,
            hasDeletedUnit: false,
            statusText: null
        });
    },
    [UNIT_DELETE_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isDeletingUnit: false,
            hasDeletedUnit: true,
            statusText: 'Unit deleted'
        });
    },
    [UNIT_DELETE_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isDeletingUnit: false,
            hasDeletedUnit: false,
            statusText: `Unit error: ${payload.statusText}`
        });
    },
    [UNIT_DELETE_RESET]: (state, payload) => {
        return Object.assign({}, state, {
            isDeletingUnit: false,
            hasDeletedUnit: false,
            statusText: null
        });
    },
    [UNIT_EDIT_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isEditingUnit: true,
            hasEditedUnit: false,
            statusText: null
        });
    },
    [UNIT_EDIT_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isEditingUnit: false,
            hasEditedUnit: true,
            statusText: 'Unit edited'
        });
    },
    [UNIT_EDIT_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            isEditingUnit: false,
            hasEditedUnit: false,
            statusText: `Unit error: ${payload.statusText}`
        });
    },
    [UNIT_EDIT_RESET]: (state, payload) => {
        return Object.assign({}, state, {
            isEditingUnit: false,
            hasEditedUnit: false,
            statusText: null
        });
    }
});
