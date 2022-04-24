import {useMemo} from 'react';
import {prop} from 'ramda';

import {convertConsumeTime, formatTimeStamp} from '../../../../utils';
import cx from './index.less';
import {RUN_STATUSES} from '../constant';
import {DEFAULT_STRING_VALUE} from '../../../../constant';

const useExecDetail = executionDetail => {
    const title = useMemo(() => {
        return `作业${executionDetail?.name || DEFAULT_STRING_VALUE}的执行详情`;
    }, [executionDetail]);

    const userName = prop('userName', executionDetail);

    // 是否忽略错误
    const ignoreError = prop('ignoreError', executionDetail);

    // 步骤列表
    const stageTriggerList = prop('stageTriggerList', executionDetail) || [];

    const beginTime = useMemo(() => {
        const beginTime = executionDetail?.beginTime;
        return formatTimeStamp(beginTime);
    }, [executionDetail]);



    const runStatus = useMemo(() => {
        //    runStatus	执行状态 1：待执行；2：执行中；3：执行失败；4：执行成功；5：执行暂停；
        return (
            <span className={cx('execute-status', `status-${executionDetail?.runStatus}`)}>
                {RUN_STATUSES.get(executionDetail?.runStatus)?.label}
            </span>
        );

    }, [executionDetail]);

    const headerDetail = [
        {
            label: '发起人：',
            value: userName,
        },
        {
            label: '发起时间：',
            value: beginTime,
        },
        {
            label: '状态：',
            value: runStatus,
        },
        {
            label: '总耗时：',
            value: convertConsumeTime(executionDetail),
        },
    ];

    return {
        title,
        headerDetail,
        stageTriggerList,
        ignoreError,
    };
};

export default useExecDetail;
