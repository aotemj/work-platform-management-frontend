import {connect} from 'react-redux';
import {compose, get} from 'lodash/fp';

import NoahList from './NoahList';
import {GET_USER_FROM_ONE_S} from '../../../sagas/types';

const mapStateToProps = state => {
    return {
        users: state.users,
    };
};

const mapDispatchToProps = (dispatch, {}) => ({
    getUsersFromOne: () => {
        dispatch({
            type: GET_USER_FROM_ONE_S,
        });
    },
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(
    withRedux,
)(NoahList);
