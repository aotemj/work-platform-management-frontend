import {
    GET_EXECUTION_DETAIL,
    UPDATE_NOAH_LIST,
    UPDATE_USERS_FROM_ONE,
    UPDATE_NOAH_DETAIL,
    UPDATE_CATEGORY_LIST,
    UPDATE_DISK_SPACE_INFO,
} from './actionTypes';

export const updateUsersFromOne_A = payload => ({
    type: UPDATE_USERS_FROM_ONE,
    payload,
});

export const getExecutionDetail_A = payload => ({
    type: GET_EXECUTION_DETAIL,
    payload,
});

export const updateNoahList_A = payload => ({
    type: UPDATE_NOAH_LIST,
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

export const updateDiskSpaceInfo_A = payload => ({
    type: UPDATE_DISK_SPACE_INFO,
    payload,
});
