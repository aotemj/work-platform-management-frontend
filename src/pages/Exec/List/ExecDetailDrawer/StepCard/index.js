import {connect} from 'react-redux';

import StepCard from './StepCard';
import {updateUserFromOne} from '../../../../../reduxSlice/uesr/userSlice';
import {updateCurrentUser} from '../../../../../reduxSlice/uesr/currentUserSlice';

const mapStateToProps = ({users, currentUser}) => ({
    users,
    currentUser,
});

const mapDispatchToProps = dispatch => ({
    updateUserFromOne: payload => dispatch(updateUserFromOne(payload)),
    updateCurrentUser: payload => dispatch(updateCurrentUser(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StepCard);
