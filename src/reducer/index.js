import {
    GET_EXECUTION_DETAIL,
    UPDATE_NOAH_DETAIL,
    GET_NOAH_LIST,
    GET_USERS_FROM_ONE,
    UPDATE_CATEGORY_LIST,
    UPDATE_DISK_SPACE_INFO,
} from '../actions/actionTypes';
import {GET_DATA_TYPES} from '../constant';
import {updateCategoryMap} from '../utils';

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
        currentPage: 1,
    },
    // 磁盘占用信息
    diskSpaceInfo: null,
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
        case UPDATE_NOAH_DETAIL:
            return {
                ...state,
                noahDetail: action.payload,
            };
        case UPDATE_CATEGORY_LIST: {
            const {INIT, MORE} = GET_DATA_TYPES;
            const {categories, type = INIT} = action.payload;
            const {list} = categories;
            let {currentPage: originCurrent, list: originList} = state.categories;
            let finalList = list;
            let currentPage = originCurrent;
            if (type === MORE) {
                finalList = [...originList, ...list];
                currentPage += 1;
            }

            return {
                ...state,
                categories: {
                    list: finalList,
                    map: updateCategoryMap(finalList),
                    currentPage,
                },
            };
        }

        case UPDATE_DISK_SPACE_INFO:
            return {
                ...state,
                diskSpaceInfo: action.payload,
            };
        default: {
            return state;
        }
    }
};
