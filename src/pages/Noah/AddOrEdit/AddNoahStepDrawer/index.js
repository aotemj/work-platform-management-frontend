import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

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

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRedux)(AddNoahStepDrawer);
