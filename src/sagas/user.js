import createSagaActions from 'saga-action-creator';
import {takeLatest, call, put} from 'redux-saga/effects';
// import {users} from '../temp/users';
// import {getUserInfo, updateUser} from '../services/user';

const user = createSagaActions({
    // By default, you can pass the generator functions
    // getUserById: function* (id) {
    //     yield put(users);
    //     yield call(() => {
    //     }, id);
    // },
    // If you need to change the effect take type
    // you can pass the object for the action name
    getUserById: {
        takeType: takeLatest,
        * effect(id, name) {
            // yield put(users);
            yield call(() => {
                // console.log('test123123');
            }, id);
        },
    },
});

export default user;
