import {connect} from 'react-redux';

import CronList from './CronList';
import {GET_NOAH_DETAIL_S, GET_NOAH_LIST_S, UPDATE_DISK_SPACE_INFO_S} from '../../../sagas/types';

const mapStateToProps = ({
    noah,
    noahDetail,
    categories: {list, map},
    diskSpaceInfo,
}) => ({
    noah,
    noahDetail,
    categories: list,
    categoryMap: map,
    diskSpaceInfo,
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
    updateDiskSpaceInfo: () => dispatch({type: UPDATE_DISK_SPACE_INFO_S}),
});

export default connect(mapStateToProps, mapDispatchToProps)(CronList);
