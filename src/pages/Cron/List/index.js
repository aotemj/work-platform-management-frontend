import {connect} from 'react-redux';
import {compose} from 'lodash/fp';

import CronList from './CronList';
import {GET_NOAH_DETAIL_S, GET_NOAH_LIST_S} from '../../../sagas/types';

const mapStateToProps = ({
    noahList,
    noahTotal,
    noahDetail,
    categories: {list, map},
}) => ({
    noahList,
    noahTotal,
    noahDetail,
    categories: list,
    categoryMap: map,
});

const mapDispatchToProps = dispatch => ({
    getNoahList: payload => dispatch({
        type: GET_NOAH_LIST_S,
        payload,
    }),
    getNoahWorkPlanDetail: payload => dispatch({
        type: GET_NOAH_DETAIL_S,
        payload,
    }),
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);
export default compose(withRedux)(CronList);
