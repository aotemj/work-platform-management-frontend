import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

import NoahList from './NoahList';
import {GET_NOAH_LIST_S, GET_USER_FROM_ONE_S, UPDATE_DISK_SPACE_INFO_S} from '../../../sagas/types';

const mapStateToProps = ({users, noahList, noahTotal, diskSpaceInfo}) => {
    return {
        users,
        noahList,
        noahTotal,
        diskSpaceInfo,
    };
};

const mapDispatchToProps = (dispatch, {}) => ({
    getUsersFromOne: () => dispatch({type: GET_USER_FROM_ONE_S}),
    getNoahList: payload => {
        dispatch({
            type: GET_NOAH_LIST_S,
            payload,
        });
    },
    updateDiskSpaceInfo: () => dispatch({type: UPDATE_DISK_SPACE_INFO_S}),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRedux)(NoahList);
