import {configureStore} from '@reduxjs/toolkit';

import userReducer, {userNameSpace} from '../reduxSlice/uesr/userSlice';
import noahReducer, {noahNameSpace} from '../reduxSlice/noah/noahSlice';
import categoryReducer, {categoryNameSpace} from '../reduxSlice/category/categorySlice';
import diskSpaceReducer, {diskSpaceNameSpace} from '../reduxSlice/diskSpace/diskSpaceSlice';
import executionDetailReducer, {executionDetailNameSpace} from '../reduxSlice/execution/detailSlice';
import noahDetailReducer, {noahDetailNameSpace} from '../reduxSlice/noah/detailSlice';
import currentUserReducer, {currentUserNameSpace} from '../reduxSlice/uesr/currentUserSlice';
import uploadDetailReducer, {uploadDetailNameSpace} from '../reduxSlice/fileUpload/uploadDetailSlice';

const store = configureStore({
    reducer: {
        [currentUserNameSpace]: currentUserReducer,
        [userNameSpace]: userReducer,
        [noahNameSpace]: noahReducer,
        [categoryNameSpace]: categoryReducer,
        [noahDetailNameSpace]: noahDetailReducer,
        [executionDetailNameSpace]: executionDetailReducer,
        [diskSpaceNameSpace]: diskSpaceReducer,
        [uploadDetailNameSpace]: uploadDetailReducer,
    },
});

export default store;
