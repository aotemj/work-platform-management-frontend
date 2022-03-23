import {GET_EXECUTION_DETAIL, GET_USERS_FROM_ONE} from './actionTypes';

export const getUsersFromOne_A = payload => ({
    type: GET_USERS_FROM_ONE,
    payload,
});

export const getExecutionDetail_A = payload => ({
    type: GET_EXECUTION_DETAIL,
    payload,
});
