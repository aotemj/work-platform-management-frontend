import {connect} from 'react-redux';

import ExecList from './ExecList';
import {GET_EXECUTION_DETAIL_S} from '../../../sagas/types';

const mapStateToProps = state => {
    return {
        executionDetail: state.executionDetail,
    };
};

const mapDispatchToProps = (dispatch, {}) => ({
    getExecutionDetail: payload => {
        dispatch({
            type: GET_EXECUTION_DETAIL_S,
            payload,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ExecList);
