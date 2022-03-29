import {
    GET_EXECUTION_DETAIL,
    GET_NOAH_DETAIL,
    GET_NOAH_LIST,
    GET_USERS_FROM_ONE,
    UPDATE_CATEGORY_LIST,
} from '../actions/actionTypes';

const initialState = {
    users: {
        list: [],
        map: new Map(),
    },
    // 执行详情
    executionDetail: null,
    // 作业方案列表
    noahList: [],
    // 作业方案 total
    noahTotal: 0,
    // 作业方案详情
    noahDetail: null,
    // 作业分类
    categories: {
        list: [],
        map: {},
    },
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
        case GET_NOAH_LIST:
            const {noahList, noahTotal} = action.payload;
            return {
                ...state,
                noahList,
                noahTotal,
            };
        case GET_NOAH_DETAIL:
            return {
                ...state,
                noahDetail: action.payload,
            };
        case UPDATE_CATEGORY_LIST:
            const {categories} = action.payload;
            return {
                ...state,
                categories,
            };
        default: {
            return state;
        }
    }
};
