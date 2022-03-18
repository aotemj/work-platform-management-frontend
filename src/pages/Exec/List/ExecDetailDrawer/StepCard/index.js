import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

import StepCard from './StepCard';
import {GET_USER_FROM_ONE_S} from '../../../../../sagas/types';

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
)(StepCard);
