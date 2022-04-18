import {connect} from 'react-redux';

import {UPDATE_USER_FROM_ONE_S} from '../../../../sagas/types';
import AddNoahStepDrawer from './AddNoahStepDrawer';

const mapStateToProps = ({users}) => ({
    users,
});

const mapDispatchToProps = dispatch => ({
    updateUserFromOne: payload => {
        dispatch({
            type: UPDATE_USER_FROM_ONE_S,
            payload,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNoahStepDrawer);
