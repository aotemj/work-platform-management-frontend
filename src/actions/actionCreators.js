import {
    GET_EXECUTION_DETAIL,
    GET_NOAH_LIST,
    GET_USERS_FROM_ONE,
    UPDATE_NOAH_DETAIL,
    UPDATE_CATEGORY_LIST,
} from './actionTypes';

export const getUsersFromOne_A = payload => ({
    type: GET_USERS_FROM_ONE,
    payload,
});

export const getExecutionDetail_A = payload => ({
    type: GET_EXECUTION_DETAIL,
    payload,
});

export const getNoahList_A = payload => ({
    type: GET_NOAH_LIST,
    payload,
});

export const getNoahDetail_A = payload => ({
    type: UPDATE_NOAH_DETAIL,
    payload,
});

export const updateCategories_A = payload => ({
    type: UPDATE_CATEGORY_LIST,
    payload,
});
