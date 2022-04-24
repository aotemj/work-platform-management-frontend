import {connect} from 'react-redux';

import ExecList from './ExecList';
import {getExecutionDetail} from '../../../reduxSlice/execution/detailSlice';

const mapStateToProps = ({executionDetail}) => ({executionDetail});

const mapDispatchToProps = dispatch => ({
    getExecutionDetail: payload => dispatch(getExecutionDetail(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExecList);
