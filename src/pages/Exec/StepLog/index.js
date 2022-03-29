import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

import StepLog from './StepLog';
import {GET_EXECUTION_DETAIL_S, GET_NOAH_DETAIL_S} from '../../../sagas/types';

const mapStateToProps = ({executionDetail, noahDetail}) => ({
    executionDetail,
    noahDetail,
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
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRedux)(StepLog);
