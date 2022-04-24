import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import urlJoin from 'url-join';
import {omit} from 'ramda';

import {
    DEFAULT_PAGINATION,
    GLOBAL_URLS,
    IS_PROD,
    REQUEST_URL_TYPES,
    TYPES_OF_FETCHING,
} from '../../constant';
import {request} from '../../request/fetch';
import {assembleRequestUrl} from '../../utils';
import {users} from '../../temp/users';

export const userNameSpace = 'users';

const {INIT} = TYPES_OF_FETCHING;

const initialState = {
    list: [],
    map: {},
    currentPage: 0,
    loading: false,
};

const updateUserMap = list => {
    const usersMap = {};
    let length = list.length;
    for (let i = 0; i < length; i++) {
        const {userId} = list[i];
        usersMap[userId] = list[i];
    }
    return usersMap;
};

// 获取用户信息
export const updateUserFromOne = createAsyncThunk(
    urlJoin(userNameSpace, 'updateUserFromOne'),
    async payload => {
        const {INIT} = TYPES_OF_FETCHING;
        const {currentPage = 0, type = INIT, name} = payload;
        let finalUserObj;
        let finalUsers;
        if (IS_PROD) {
            const {pageSize} = DEFAULT_PAGINATION;
            finalUserObj = await request({
                url: assembleRequestUrl(GLOBAL_URLS.GET_USERS, REQUEST_URL_TYPES.EXTERNAL.label),
                params: {
                    applyStatus: '',
                    name,
                    userType: 'USER',
                    groupId: '',
                    directoryId: '',
                    title: '',
                    _offset: currentPage * pageSize,
                    _limit: pageSize,
                },
            });
            finalUserObj = omit(['status', 'msg'], finalUserObj);
            finalUserObj.length = Object.keys(finalUserObj).length;
            finalUsers = Array.from(finalUserObj);
        } else {
            finalUsers = users;
        }

        return {
            list: finalUsers,
            map: updateUserMap(finalUsers),
            type,
            currentPage,
        };
    });

const init =  (state, action) => {
    const {list, currentPage} = action.payload;

    state.list = list;
    state.map = updateUserMap(list);
    state.currentPage = currentPage;
};

const loadMore = (state, action) => {
    let {list, currentPage} = action.payload;
    let {currentPage: originCurrent, list: originList} = state.users;
    list = [...originList, ...list];
    currentPage = originCurrent + 1;

    state.list = list;
    state.map = updateUserMap(list);
    state.currentPage = currentPage;
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: {
        [updateUserFromOne.pending]: state => {
            state.loading = true;
        },
        [updateUserFromOne.fulfilled]: (state, action) => {
            const {type = INIT} = action.payload;
            state.loading = false;
            return type === INIT ? init(state, action) : loadMore(state, action);
        },
        [updateUserFromOne.rejected]: state => {
            state.loading = false;
        },
    },
});

export default userSlice.reducer;
