import {useParams} from 'react-router-dom';
import {useEffect, useMemo, useState} from 'react';

/**
 * 步骤日志 hook
 */
const useStepLog = (executionDetail, getExecutionDetail) => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const getExecuteId = () => {
        const {executeId} = params;
        getExecutionDetail(executeId);
    };
    const stageTriggerItemList = useMemo(() => {
        return executionDetail
            ?.stageTriggerList
            ?.filter(item => item.id === Number(params.stepId))[0]?.stageTriggerItemList || [];
    }, [executionDetail, params]);

    const dataSource = useMemo(() => {
        return stageTriggerItemList?.map(item => {
            const {stageTriggerItemParams, consumeTime, logShowList, runStatus, errorInfo, allTaskSuccess} = item;
            const targetResource = stageTriggerItemParams?.targetResource;
            const id = stageTriggerItemParams.id;
            return targetResource && logShowList ? {
                key: id,
                id: id,
                IP: targetResource?.targetResourceName,
                consumeTime,
                logShowList,
                runStatus,
                errorInfo,
                allTaskSuccess,
            } : null;
        }).filter(Boolean);
    }, [stageTriggerItemList]);
    const errorInfo = useMemo(() => {
        if (!dataSource.length) {
            return stageTriggerItemList[0]?.errorInfo;
        }
        return '';

    }, [dataSource, stageTriggerItemList]);
    useEffect(() => {
        getExecuteId();
    }, []);
    return {
        dataSource,
        params,
        errorInfo,
        loading,
        setLoading,
    };
};

export default useStepLog;
