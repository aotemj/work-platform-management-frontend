import {connect} from 'react-redux';

import DiskSpace from './DiskSpace';
import {UPDATE_DISK_SPACE_INFO_S} from '../../sagas/types';

const mapStateToProps = ({diskSpaceInfo}) => ({diskSpaceInfo});

const mapDispatchToProps = dispatch => ({
    updateDiskSpaceInfo: () => dispatch({type: UPDATE_DISK_SPACE_INFO_S}),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiskSpace);
