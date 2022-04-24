import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import urlJoin from 'url-join';

import {request} from '../../request/fetch';
import {REQUEST_CODE} from '../../constant';
import {URLS} from '../../pages/Exec/List/constant';
import {assembleRequestUrl} from '../../utils';

const initialState = null;

export const executionDetailNameSpace = 'executionDetail';

const update = (state, action) => action.payload;

export const getExecutionDetail = createAsyncThunk(
    urlJoin(executionDetailNameSpace, 'getExecutionDetail'),
    async payload => {
        const res = await request({
            url: assembleRequestUrl(urlJoin(URLS.GET_EXECUTION_DETAIL, String(payload))),
        });
        const {code, data} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            return data;
        }
        return null;
    });

const executionDetailSlice = createSlice({
    name: executionDetailNameSpace,
    initialState,
    reducers: {},
    extraReducers: {
        [getExecutionDetail.fulfilled]: (state, action) => update(state, action),
    },
});

export default executionDetailSlice.reducer;
