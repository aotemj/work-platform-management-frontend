import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import urlJoin from 'url-join';

import {request} from '../../request/fetch';
import {PROMISE_STATUS} from '../../constant';
import {URLS} from '../../pages/Exec/List/constant';
import {assembleRequestUrl} from '../../utils';

const initialState = null;

export const diskSpaceNameSpace = 'diskSpace';

const promise1 = async () => await request({url: assembleRequestUrl(URLS.DISK_SPACE_INFO)});

const promise2 = async () => await request({url: assembleRequestUrl(URLS.CHECK_DISK_SPACE)});

export const updateDiskSpaceInfo = createAsyncThunk(
    urlJoin(diskSpaceNameSpace, 'updateDiskSpaceInfo'),
    async () => {
        const resList = await Promise.allSettled([promise1(), promise2()]);
        let info = {};
        resList.forEach(res => {
            const {value, status} = res;
            if (status === PROMISE_STATUS.FULFILLED) {
                info = {
                    ...info,
                    ...value?.data,
                };
            }
        });
        return info;
    });

const update = (state, action) => action.payload;
const diskSpaceSlice = createSlice({
    name: diskSpaceNameSpace,
    initialState,
    reducers: {},
    extraReducers: {
        [updateDiskSpaceInfo.fulfilled]: (state, action) => update(state, action),
    },
});

export default diskSpaceSlice.reducer;
