import {connect} from 'react-redux';

import CronList from './CronList';
import {getNoahList} from '../../../reduxSlice/noah/noahSlice';
import {getCategoryList} from '../../../reduxSlice/category/categorySlice';
import {getNoahWorkPlanDetail} from '../../../reduxSlice/noah/detailSlice';
import {updateDiskSpaceInfo} from '../../../reduxSlice/diskSpace/diskSpaceSlice';

const mapStateToProps = ({
    noah,
    noahDetail,
    category: {list, map},
    diskSpace: diskSpaceInfo,
}) => ({
    noah,
    noahDetail,
    categories: list,
    categoryMap: map,
    diskSpaceInfo,
});

const mapDispatchToProps = dispatch => ({
    getCategoryList: payload => dispatch(getCategoryList(payload)),
    getNoahList: payload => dispatch(getNoahList(payload)),
    getNoahWorkPlanDetail: payload => dispatch(getNoahWorkPlanDetail(payload)),
    updateDiskSpaceInfo: () => dispatch(updateDiskSpaceInfo()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CronList);
