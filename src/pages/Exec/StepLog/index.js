import {connect} from 'react-redux';

import StepLog from './StepLog';
import {GET_EXECUTION_DETAIL_S, GET_NOAH_DETAIL_S, UPDATE_CATEGORY_LIST_S} from '../../../sagas/types';

const mapStateToProps = ({
    executionDetail,
    noahDetail,
    categories: {list, map},
}) => ({
    executionDetail,
    noahDetail,
    categories: list,
    categoryMap: map,
});

const mapDispatchToProps = dispatch => ({
    getExecutionDetail: payload => {
        dispatch({
            type: GET_EXECUTION_DETAIL_S,
            payload,
        });
    },
    getNoahWorkPlanDetail: payload => dispatch({
        type: GET_NOAH_DETAIL_S,
        payload,
    }),
    getCategoryList: payload => dispatch({
        type: UPDATE_CATEGORY_LIST_S,
        payload,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StepLog);
