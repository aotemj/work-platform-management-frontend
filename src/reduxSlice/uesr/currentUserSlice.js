import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import urlJoin from 'url-join';

import {GLOBAL_URLS, IS_PROD} from '../../constant';
import {request} from '../../request/fetch';
import {assembleExternalUrl} from '../../utils';
import {currentUsers} from '../../temp/users';

const initialState = null;

export const currentUserNameSpace = 'currentUser';

export const updateCurrentUser = createAsyncThunk(urlJoin(currentUserNameSpace, 'updateCurrentUser'), async () => {
    let res;
    if (IS_PROD) {
        res = await request({url: assembleExternalUrl(GLOBAL_URLS.CURRENT_USER)});
    } else {
        res = currentUsers;
    }
    const {code, payload} = res;
    if (!code) {
        return payload;
    }
});

const update = (state, action) => action.payload;

const currentUserSlice = createSlice({
    name: currentUserNameSpace,
    initialState,
    reducers: {
    },
    extraReducers: {
        [updateCurrentUser.fulfilled]: (state, action) => update(state, action),
    },
});


export default currentUserSlice.reducer;
