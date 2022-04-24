import {connect} from 'react-redux';

import AddOrEditNoah from './AddOrEditNoah';
import {addItem, getCategoryList} from '../../../reduxSlice/category/categorySlice';
import {getNoahWorkPlanDetail, update} from '../../../reduxSlice/noah/detailSlice';

const mapStateToProps = state => {
    const {noahDetail, category: categories} = state;
    return {
        noahDetail,
        categories,
    };
};

const mapDispatchToProps = dispatch => ({
    getNoahWorkPlanDetail: payload => dispatch(getNoahWorkPlanDetail(payload)),
    getCategoryList: payload => dispatch(getCategoryList(payload)),
    updateCategory: payload => dispatch(addItem(payload)),
    updateNoahDetail: payload => dispatch(update(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddOrEditNoah);
