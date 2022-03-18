import createSagaActions from 'saga-action-creator';
import {takeLatest, call, put} from 'redux-saga/effects';
// import {users} from '../temp/users';
// import {getUserInfo, updateUser} from '../services/user';

const user = createSagaActions({
    getUserById: {
        takeType: takeLatest,
        * effect(id, name) {
            // TODO user 数据动态化
            // yield put(users);
            yield call(() => {
                // console.log('test123123');
            }, id);
        },
    },
});

export default user;
