import {GET_EXECUTION_DETAIL, GET_USERS_FROM_ONE} from '../actions/actionTypes';

const initialState = {
    users: {
        list: [],
        map: new Map(),
    },
    // 执行详情
    executionDetail: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_USERS_FROM_ONE:
            return {
                ...state,
                users: action.payload,
            };
        case GET_EXECUTION_DETAIL:
            return {
                ...state,
                executionDetail: action.payload,
            };
        default: {
            return state;
        }
    }
};
