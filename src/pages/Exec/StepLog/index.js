import {connect} from 'react-redux';

import StepLog from './StepLog';
import {getCategoryList} from '../../../reduxSlice/category/categorySlice';
import {getExecutionDetail} from '../../../reduxSlice/execution/detailSlice';
import {getNoahWorkPlanDetail, update} from '../../../reduxSlice/noah/detailSlice';

const mapStateToProps = ({
    executionDetail,
    noah,
    noahDetail,
    category: {list, map},
}) => ({
    noah,
    executionDetail,
    noahDetail,
    categories: list,
    categoryMap: map,
});

const mapDispatchToProps = dispatch => ({
    getExecutionDetail: payload => dispatch(getExecutionDetail(payload)),
    getNoahWorkPlanDetail: payload => dispatch(getNoahWorkPlanDetail(payload)),
    getCategoryList: payload => dispatch(getCategoryList(payload)),
    updateNoahDetail: payload => dispatch(update(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StepLog);
