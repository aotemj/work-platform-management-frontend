import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

import StepCard from './StepCard';
import {UPDATE_USER_FROM_ONE_S} from '../../../../../sagas/types';

const mapStateToProps = ({users}) => ({
    users,
});

const mapDispatchToProps = dispatch => ({
    updateUserFromOne: () => {
        dispatch({
            type: UPDATE_USER_FROM_ONE_S,
        });
    },
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRedux)(StepCard);
