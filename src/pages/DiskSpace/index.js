import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

import DiskSpace from './DiskSpace';
import {UPDATE_DISK_SPACE_INFO_S} from '../../sagas/types';

const mapStateToProps = ({diskSpaceInfo}) => ({diskSpaceInfo});

const mapDispatchToProps = dispatch => ({
    updateDiskSpaceInfo: () => dispatch({type: UPDATE_DISK_SPACE_INFO_S}),
});
const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRedux)(DiskSpace);
