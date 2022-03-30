import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

import {UPDATE_CATEGORY_LIST_S, GET_NOAH_DETAIL_S} from '../../../sagas/types';
import AddOrEditNoah from './AddOrEditNoah';
import {UPDATE_CATEGORY_LIST, UPDATE_NOAH_DETAIL} from '../../../actions/actionTypes';

const mapStateToProps = ({noahDetail, categories}) => ({
    noahDetail,
    categories,
});

const mapDispatchToProps = dispatch => ({
    getNoahWorkPlanDetail: payload => dispatch({
        type: GET_NOAH_DETAIL_S,
        payload,
    }),
    getCategoryList: payload => dispatch({
        type: UPDATE_CATEGORY_LIST_S,
        payload,
    }),
    updateCategory: payload => dispatch({
        type: UPDATE_CATEGORY_LIST,
        payload,
    }),
    updateNoahDetail: payload => dispatch({
        type: UPDATE_NOAH_DETAIL,
        payload,
    }),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export default compose(withRedux)(AddOrEditNoah);
