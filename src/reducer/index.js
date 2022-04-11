import {
    GET_EXECUTION_DETAIL,
    UPDATE_NOAH_DETAIL,
    UPDATE_NOAH_LIST,
    GET_USERS_FROM_ONE,
    UPDATE_CATEGORY_LIST,
    UPDATE_DISK_SPACE_INFO,
} from '../actions/actionTypes';
import {TYPES_OF_FEATING} from '../constant';
import {updateCategoryMap} from '../utils';

const initialState = {
    users: {
        list: [],
        map: new Map(),
    },
    // 执行详情
    executionDetail: null,
    noah: {
        list: [],
        total: 0,
        currentPage: 1,
    },
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
    const {INIT, MORE} = TYPES_OF_FEATING;

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
        case UPDATE_NOAH_LIST:
            let {list, total, type = INIT, currentPage} = action.payload;
            let {currentPage: originCurrent, list: originList} = state.noah;
            let finalList = list;
            if (type === MORE) {
                finalList = [...originList, ...list];
                currentPage = originCurrent + 1;
            }
            return {
                ...state,
                noah: {
                    list: finalList,
                    currentPage,
                    total,
                },
            };
        case UPDATE_NOAH_DETAIL:
            return {
                ...state,
                noahDetail: action.payload,
            };
        case UPDATE_CATEGORY_LIST: {
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
