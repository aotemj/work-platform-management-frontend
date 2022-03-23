import {put, all, takeLatest} from 'redux-saga/effects';

import {getExecutionDetail_A, getUsersFromOne_A} from '../actions/actionCreators.js';
import {users} from '../temp/users';
import {GET_EXECUTION_DETAIL_S, GET_USER_FROM_ONE_S} from './types';
import {request} from '../request/fetch';
import {REQUEST_CODE, COMMON_URL_PREFIX, GLOBAL_URLS, ONE_URL_PREFIX, IS_PROD} from '../constant';
import {URLS} from '../pages/Exec/List/constant';

function* getUsersFromOne() {
    let finalUsers = [];
    if (IS_PROD) {
        finalUsers = yield request({
            url: `${ONE_URL_PREFIX}${GLOBAL_URLS.GET_USERS}`,
        });
    } else {
        finalUsers = users;
    }

    const usersMap = new Map();

    for (let i = 0; i < users.length; i++) {
        const {userId} = users[i];
        usersMap.set(userId, users[i]);
    }

    yield put(getUsersFromOne_A({
        list: finalUsers,
        map: usersMap,
    }));
}

function* getExecutionDetail({payload}) {
    const res = yield request({
        url: `${COMMON_URL_PREFIX}${URLS.GET_EXECUTION_DETAIL}${payload}`,
    });
    const {code, data} = res;
    if (code === REQUEST_CODE.SUCCESS) {
        yield put(getExecutionDetail_A(data));
    } else {
        yield put(getExecutionDetail_A(null));
    }
}

export default function* () {
    yield all([
        takeLatest(GET_USER_FROM_ONE_S, getUsersFromOne),
        takeLatest(GET_EXECUTION_DETAIL_S, getExecutionDetail),
    ]);
};
