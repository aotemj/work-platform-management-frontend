import {connect} from 'react-redux';

import AddNoahStepDrawer from './AddNoahStepDrawer';
import {updateUserFromOne} from '../../../../reduxSlice/uesr/userSlice';

const mapStateToProps = ({users}) => ({users});

const mapDispatchToProps = dispatch => ({
    updateUserFromOne: payload => dispatch(updateUserFromOne(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddNoahStepDrawer);
