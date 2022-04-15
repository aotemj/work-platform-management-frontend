import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

import StepCard from './StepCard';
import {UPDATE_CURRENT_USER_S, UPDATE_USER_FROM_ONE_S} from '../../../../../sagas/types';

const mapStateToProps = ({users, currentUser}) => ({
    users,
    currentUser,
});

const mapDispatchToProps = dispatch => ({
    updateUserFromOne: payload => {
        dispatch({
            type: UPDATE_USER_FROM_ONE_S,
            payload,
        });
    },
    updateCurrentUser: payload => {
        dispatch({
            type: UPDATE_CURRENT_USER_S,
            payload,
        });
    },
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRedux)(StepCard);
