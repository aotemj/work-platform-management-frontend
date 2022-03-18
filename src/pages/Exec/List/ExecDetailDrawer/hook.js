import {useEffect, useMemo} from 'react';

import {formatTimeStamp, getDateTime} from '../../../../utils';
import cx from './index.less';
import {RUN_STATUSES} from '../constant';

const useExecDetail = executionDetail => {
    const title = useMemo(() => {
        return `作业${executionDetail?.name}的执行详情`;
    }, [executionDetail]);

    const userName = useMemo(() => {
        return executionDetail?.userName;
    }, [executionDetail]);

    const beginTime = useMemo(() => {
        const beginTime = executionDetail?.beginTime;
        return formatTimeStamp(beginTime);
    }, [executionDetail]);

    // 是否忽略错误
    const ignoreError = useMemo(() => {
        return executionDetail?.ignoreError;
    }, [executionDetail]);

    // 总耗时
    const consumeTime = useMemo(() => {
        let {consumeTime = null, beginTime} = executionDetail;
        if (!consumeTime && beginTime) {
            consumeTime = (Date.now() - beginTime) / 1000;
        }
        const {
            dayTime,
            hourTime,
            minuteTime,
            secondTime,
        } = getDateTime(consumeTime * 1000);
        const dateStr = dayTime ? `${dayTime}d` : '';
        const hourStr = hourTime ? `${hourTime}h` : '';
        const minuteStr = minuteTime ? `${minuteTime}m` : '';
        const secondStr = secondTime ? `${secondTime}s` : '';
        return `${dateStr}${hourStr}${minuteStr}${secondStr}`;
    }, [executionDetail]);
    // 步骤列表
    const stageTriggerList = useMemo(() => {
        return executionDetail?.stageTriggerList || [];
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
            //  TODO 耗时未 null 时前端自己计算耗时
            value: consumeTime,
        },
    ];
    useEffect(() => {

    });
    return {
        title,
        headerDetail,
        stageTriggerList,
        ignoreError,
    };
};

export default useExecDetail;
