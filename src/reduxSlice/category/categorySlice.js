import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {omit} from 'ramda';
import urlJoin from 'url-join';

import {assembleRequestUrl, updateCategoryMap} from '../../utils';
import {DEFAULT_PAGINATION, REQUEST_CODE, TYPES_OF_FETCHING} from '../../constant';
import {request} from '../../request/fetch';
import {URLS} from '../../pages/Exec/List/constant';

export const categoryNameSpace = 'category';

const initialState = {
    list: [],
    loading: false,
    map: {},
    currentPage: 0,
};

const {INIT} = TYPES_OF_FETCHING;

export const getCategoryList = createAsyncThunk(
    urlJoin(categoryNameSpace, 'getCategoryList'),
    async payload => {
        const {type = INIT, currentPage} = payload;

        const res = await request({
            url: assembleRequestUrl(URLS.CATEGORIES),
            params: {
                currentPage,
                pageSize: DEFAULT_PAGINATION.pageSize,
                ...omit(['type'], payload),
            },
        });
        const {data, code} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            const {list, currentPage} = data;

            return {
                list,
                currentPage,
                type,
            };
        }

    },
);

const init = (state, action) => {
    const {list, currentPage} = action.payload;
    state.list = list;
    state.map = updateCategoryMap(list);
    state.currentPage = currentPage;
};
const loadMore = (state, action) => {
    let {list, currentPage} = action.payload;
    let {currentPage: originCurrent, list: originList} = state.users;
    list = [...originList, ...list];
    currentPage = originCurrent + 1;
    return {
        ...state,
        list,
        currentPage,
        map: updateCategoryMap(list),
    };
};
const categorySlice = createSlice({
    name: categoryNameSpace,
    initialState,
    reducers: {
        addItem(state, {payload}) {
            const {name} = payload;
            state.list = [payload, ...state.list];
            state.map[name] = payload;
        },
    },
    extraReducers: {
        [getCategoryList.pending]: state => {
            state.loading = true;
        },
        [getCategoryList.fulfilled]: (state, action) => {
            const {type = INIT} = action.payload;
            state.loading = false;
            return type === INIT ? init(state, action) : loadMore(state, action);
        },
        [getCategoryList.rejected]: state => {
            state.loading = false;
        },
    },
});

export const {addItem} = categorySlice.actions;


export default categorySlice.reducer;
