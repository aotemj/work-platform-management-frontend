import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

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

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(
    withRedux,
)(ExecList);
