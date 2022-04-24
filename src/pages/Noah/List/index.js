import {connect} from 'react-redux';

import NoahList from './NoahList';
import {getNoahList} from '../../../reduxSlice/noah/noahSlice';
import {getCategoryList} from '../../../reduxSlice/category/categorySlice';
import {updateDiskSpaceInfo} from '../../../reduxSlice/diskSpace/diskSpaceSlice';
import {updateUserFromOne} from '../../../reduxSlice/uesr/userSlice';

const mapStateToProps = ({
    users,
    noah,
    diskSpaceInfo,
    category: categories,
}) => ({
    users,
    noah,
    diskSpaceInfo,
    categories,
});

const mapDispatchToProps = dispatch => ({
    updateUserFromOne: payload => dispatch(updateUserFromOne(payload)),
    getNoahList: payload => dispatch(getNoahList(payload)),
    updateDiskSpaceInfo: () => dispatch(updateDiskSpaceInfo()),
    getCategoryList: payload => dispatch(getCategoryList(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NoahList);
