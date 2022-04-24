import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {omit} from 'ramda';
import urlJoin from 'url-join';

import {DEFAULT_PAGINATION, REQUEST_CODE, TYPES_OF_FETCHING} from '../../constant';
import {request} from '../../request/fetch';
import {URLS} from '../../pages/Exec/List/constant';
import {assembleRequestUrl} from '../../utils';

export const noahNameSpace = 'noah';

const initialState = {
    loading: false,
    list: [],
    total: 0,
    currentPage: 1,
};
const {INIT} = TYPES_OF_FETCHING;

export const getNoahList = createAsyncThunk(
    urlJoin(noahNameSpace, 'getNoahList'),
    async payload => {
        const {type = INIT, pageSize = DEFAULT_PAGINATION.pageSize} = payload;

        const res = await request({
            url: assembleRequestUrl(URLS.LIST),
            params: {
                pageSize,
                ...omit(['type'], payload),
            },
        });
        const {code, data: result} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            const {list = [], total, currentPage} = result;

            return {
                list: list.map(item => ({...item, key: item.id})),
                total: total,
                currentPage,
                type,
            };
        }
    },
);

const init = (state, action) => {
    const {list, currentPage, total} = action.payload;
    state.list = list;
    state.currentPage = currentPage;
    state.total = total;
};
const loadMore = (state, action) => {
    let {list, currentPage, total} = action.payload;
    let {currentPage: originCurrent, list: originList} = state;
    list = [...originList, ...list];
    currentPage = originCurrent + 1;
    state.list = list;
    state.currentPage = currentPage;
    state.total = total;
};

const noahSlice = createSlice({
    name: noahNameSpace,
    initialState,
    reducers: {},
    extraReducers: {
        [getNoahList.pending]: state => {
            state.loading = true;
        },
        [getNoahList.fulfilled]: (state, action) => {
            const {type = INIT} = action.payload;
            state.loading = false;
            return type === INIT ? init(state, action) : loadMore(state, action);
        },
        [getNoahList.rejected]: state => {
            state.loading = false;
        },
    },
});

export default noahSlice.reducer;
