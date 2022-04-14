import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

import NoahList from './NoahList';
import {
    GET_NOAH_LIST_S,
    UPDATE_USER_FROM_ONE_S,
    UPDATE_CATEGORY_LIST_S,
    UPDATE_DISK_SPACE_INFO_S,
} from '../../../sagas/types';

const mapStateToProps = ({
    users,
    noah,
    diskSpaceInfo,
    categories,
}) => {
    return {
        users,
        noah,
        diskSpaceInfo,
        categories,
    };
};

const mapDispatchToProps = (dispatch, {}) => ({
    updateUserFromOne: payload => dispatch({type: UPDATE_USER_FROM_ONE_S, payload}),
    getNoahList: payload => {
        dispatch({
            type: GET_NOAH_LIST_S,
            payload,
        });
    },
    updateDiskSpaceInfo: () => dispatch({type: UPDATE_DISK_SPACE_INFO_S}),
    getCategoryList: payload => dispatch({
        type: UPDATE_CATEGORY_LIST_S,
        payload,
    }),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRedux)(NoahList);
