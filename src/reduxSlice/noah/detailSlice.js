import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import urlJoin from 'url-join';

import {request} from '../../request/fetch';
import {REQUEST_CODE} from '../../constant';
import {URLS} from '../../pages/Exec/List/constant';
import {assembleRequestUrl} from '../../utils';

const initialState = {
    loading: false,
    detail: null,
};

export const noahDetailNameSpace = 'noahDetail';

export const getNoahWorkPlanDetail = createAsyncThunk(
    urlJoin(noahDetailNameSpace, 'getNoahWorkPlanDetail'),
    async payload => {
        const res = await request({
            url: assembleRequestUrl(urlJoin(URLS.GET_NOAH_WORK_PLAN_DETAIL, String(payload))),
        });
        const {code, data} = res;
        return code === REQUEST_CODE.SUCCESS ? data : null;
    });

const updateData = (state, action) => {
    state.detail = action.payload;
};
const noahDetailSlice = createSlice({
    name: noahDetailNameSpace,
    initialState,
    reducers: {
        update: updateData,
    },
    extraReducers: {
        [getNoahWorkPlanDetail.pending]: (state, action) => {
            state.loading = true;
        },
        [getNoahWorkPlanDetail.fulfilled]: (state, action) => {
            state.loading = false;
            return updateData(state, action);
        },
        [getNoahWorkPlanDetail.rejected]: (state, action) => {
            state.loading = false;
        },
    },
});

export const {update} = noahDetailSlice.actions;

export default noahDetailSlice.reducer;
