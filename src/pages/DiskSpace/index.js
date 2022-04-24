import {connect} from 'react-redux';

import DiskSpace from './DiskSpace';
import {updateDiskSpaceInfo} from '../../reduxSlice/diskSpace/diskSpaceSlice';

const mapStateToProps = ({diskSpace: diskSpaceInfo}) => ({diskSpaceInfo});

const mapDispatchToProps = dispatch => ({
    updateDiskSpaceInfo: () => dispatch(updateDiskSpaceInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DiskSpace);
