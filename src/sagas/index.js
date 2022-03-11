import {takeEvery, put, all, call, takeLatest} from 'redux-saga/effects';
// import {GET_USERS_FROM_ONE} from '../actions/actionTypes';
import {getUsersFromOne_A} from '../actions/actionCreators.js';
// import {GLOBAL_URLS, URL_PREFIX1} from '../constant';
// import {request} from '../request/fetch';
import {users} from '../temp/users';
// import createSagaActions from 'saga-action-creator';
import {GET_USER_FROM_ONE_S} from './types';
// export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function* getUsersFromOne() {
    // const res = yield request({
    //     url: `${URL_PREFIX1}${GLOBAL_URLS.GET_USERS}`,
    // });
    // yield call(delay, 1000);
    // TODO 临时mock 数据， 上线需要移除
    const usersMap = new Map();

    for (let i = 0; i < users.length; i++) {
        const {userId} = users[i];
        usersMap.set(userId, users[i]);
    }

    yield put(getUsersFromOne_A({
        list: users,
        map: usersMap,
    }));
}

export default function* () {
    yield all([
        takeLatest(GET_USER_FROM_ONE_S, getUsersFromOne),
    ]);
};
