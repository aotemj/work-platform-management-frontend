import {createSlice} from '@reduxjs/toolkit';
import {isNil} from 'ramda';

const initialState = {
    loading: false,
    uploadingMap: {
    },
    serverFilesMap: {},
    localFilesMap: {},
};

export const uploadDetailNameSpace = 'uploadDetail';

const uploadDetailSlice = createSlice({
    name: uploadDetailNameSpace,
    initialState,
    reducers: {
        update: (state, action) => {
            const {fileName, process, total} = action.payload;
            state.uploadingMap[fileName] = {process, total};
        },
        updateAll: (state, action) => {
            const {serverFileMap, localFileMap} = action.payload;
            state.serverFilesMap = serverFileMap;
            state.localFilesMap = localFileMap;
        },
        updateServerFile: (state, action) => {
            const {key, value} = action.payload;
            if (isNil(key)) {
                state.serverFilesMap = {};
                return;
            }
            value ? state.serverFilesMap[key] = value : delete state.serverFilesMap[key];
        },
        updateLocalFile: (state, action) => {
            const {key, value} = action.payload;
            if (isNil(key)) {
                state.localFilesMap = {};
                return;
            }
            value ? state.localFilesMap[key] = value : delete state.localFilesMap[key];
        },
        updateLocalFileBySingleProperty: (state, action) => {
            const {key, changedValues} = action.payload;
            for (const index in changedValues) {
                const {key: changedKey, value} = changedValues[index];
                state.localFilesMap[key][changedKey] = value;
            }
        },
        updateServerFileBySingleProperty: (state, action) => {
            const {key, changedValues} = action.payload;
            for (const index in changedValues) {
                const {key: changedKey, value} = changedValues[index];
                state.serverFilesMap[key][changedKey] = value;
            }
        },
    },
    extraReducers: {},
});

export const {
    update,
    updateServerFile,
    updateLocalFile,
    updateLocalFileBySingleProperty,
    updateServerFileBySingleProperty,
    updateAll,
} = uploadDetailSlice.actions;

export default uploadDetailSlice.reducer;
