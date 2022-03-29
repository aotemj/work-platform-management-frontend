import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

import NoahList from './NoahList';
import {GET_NOAH_LIST_S, GET_USER_FROM_ONE_S} from '../../../sagas/types';

const mapStateToProps = state => {
    return {
        users: state.users,
        noahList: state.noahList,
        noahTotal: state.noahTotal,
    };
};

const mapDispatchToProps = (dispatch, {}) => ({
    getUsersFromOne: () => {
        dispatch({
            type: GET_USER_FROM_ONE_S,
        });
    },
    getNoahList: payload => {
        dispatch({
            type: GET_NOAH_LIST_S,
            payload,
        });
    },
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRedux)(NoahList);
