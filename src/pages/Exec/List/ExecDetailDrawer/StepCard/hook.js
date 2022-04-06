import {useCallback, useEffect, useMemo, useState} from 'react';
import {message, Modal} from '@osui/ui';
import {prop} from 'ramda';
import {useNavigate} from 'react-router-dom';

import {convertConsumeTime, formatTimeStamp, getContainerDOM} from '../../../../../utils';
import {
    DEFAULT_STRING_VALUE,
    REQUEST_CODE,
    REQUEST_METHODS,
    SPLIT_SYMBOL,
    STEP_TYPES,
    COMMON_URL_PREFIX,
} from '../../../../../constant';
import {CONFIRM_RESULTS, FAILED, IGNORE_ERROR, NOT_PASS, PASS, RUN_STATUSES, SUCCESS, URLS} from '../../constant';
import {request} from '../../../../../request/fetch';
import {routes} from '../../../../../routes';
import {entirelyRetry, neglectErrors} from '../util';

const useStepCard = ({detail, getUsersFromOne, submitCallback, users, executionDetail}) => {
    const navigate = useNavigate();
    const [noPassVisible, setNoPassVisible] = useState(false);
    const name = useMemo(() => {
        return detail?.name;
    }, [detail]);

    // 失败IP重试 暂时隐藏，后期迭代
    // const reTryWithFailedIPs = () => {
    //
    // };

    const viewLog = useCallback(() => {
        const {id: executeId, workPlanId: detailId} = executionDetail;
        const {id: stepId} = detail;
        navigate(`${routes.EXEC_LOG.getUrl(detailId, executeId, stepId)}`);
    }, [detail, executionDetail, navigate]);

    // NOTE  步骤类型
    //  人工确认  类型没有 结束时间
    const type = useMemo(() => {
        return detail?.type;
    }, [detail]);

    const stageTriggerItemList = prop('stageTriggerItemList', detail) || [];

    const stageTriggerItemParams = prop('stageTriggerItemParams', stageTriggerItemList[0]);

    const stageTriggerItemId = prop('id', stageTriggerItemList[0]);

    // 是否忽略错误 	错误是否被忽略：0：否；1：是
    const ignoreError = prop('ignoreError', detail);

    // 人工确认相关参数
    const stageConfirm = prop('stageConfirm', stageTriggerItemParams);

    // 人工确认结果（不通过或通过）
    const stageConfirmResult = prop('stageConfirmResult', stageTriggerItemParams);

    const isNotPass = useMemo(() => {
        return stageConfirmResult && stageConfirmResult.confirmResult === CONFIRM_RESULTS.NO_PASS;
    }, [stageConfirmResult]);

    const notPassReason = prop('noPassReason', stageConfirmResult);

    const isManualConfirm = type === STEP_TYPES.MANUAL_CONFIRM.value;

    const timeDetails = useMemo(() => {
        if (!detail) {
            return [];
        }
        const {beginTime, endTime} = detail;
        const endTimeObj = {
            label: isManualConfirm ? '审核时间：' : '结束时间：',
            value: formatTimeStamp(endTime),
        };

        return [
            {
                label: '开始时间：',
                value: formatTimeStamp(beginTime),
            },
            endTimeObj,
        ];

    }, [detail, isManualConfirm]);

    const consumeObj = {
        label: '耗时：',
        value: convertConsumeTime(detail),
    };

    const handleToggleNoPassReasonModal = useCallback((status = false) => {
        setNoPassVisible(status);
    }, []);

    const confirmManualResult = useCallback(async params => {
        // confirmResult	人工确认结果	body	true
        // confirmResult	人工确认结果 1：通过；2：不通过；		false   // integer
        // id	作业步骤任务执行记录id		false   // integer
        // noPassReason	不通过原因		false   // string
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.CONFIRM_MANUAL_RESULT}`,
            method: REQUEST_METHODS.POST,
            params,
        });
        const {code} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            message.success('操作成功');
            setNoPassVisible(false);
            submitCallback();
        }
    }, [submitCallback]);

    const handlePass = useCallback(() => {
        Modal.confirm({
            title: '提示',
            content: `${name} 是否确认通过？`,
            getContainer: getContainerDOM,
            onOk: () => {
                const params = {
                    confirmResult: CONFIRM_RESULTS.PASS,
                    id: stageTriggerItemId,
                };
                confirmManualResult(params);
            },
        });
    }, [confirmManualResult, name, stageTriggerItemId]);

    const operations = useMemo(() => {
        const {runStatus, ignoreError} = detail;

        const ignoreErrorObj = {
            label: '忽略错误',
            execution: neglectErrors,
            disabled: ignoreError,
        };

        const failedOperations = [
            ignoreErrorObj,
            // 暂时隐藏, 后期迭代
            // {
            //     label: '失败IP重试',
            //     execution: reTryWithFailedIPs,
            // },
            {
                label: '全部主机重试',
                execution: entirelyRetry,
                disabled: ignoreError,
            },
        ];

        const viewLogObj = {
            label: '查看日志',
            execution: viewLog,
        };

        let tempArr = [];
        if (runStatus === FAILED.value) {
            tempArr.unshift(...failedOperations);
        }
        if (runStatus === FAILED.value || runStatus === SUCCESS.value) {
            tempArr.push(viewLogObj);
        }
        return tempArr;
    }, [detail, viewLog]);

    const manualConfirmDescContents = useMemo(() => {
        const getInformUser = () => {
            const informUserId = stageConfirm?.informUserId;
            if (!informUserId) {
                return [DEFAULT_STRING_VALUE];
            }
            const ids = informUserId.split(SPLIT_SYMBOL);
            if (ids) {
                return ids.map(id => {
                    return users.map.get(id)?.enterpriseCard || null;
                }).filter(item => item);
            }
        };

        const informUser = getInformUser().join(SPLIT_SYMBOL);

        const informUserObj = {
            label: '确认人：',
            value: informUser,
        };
        const tempArr = [
            {
                label: '通知描述：',
                value: stageConfirm?.describes,
            },
        ];

        if (isNotPass) {
            tempArr.push({
                label: '不通过原因：',
                value: notPassReason,
            });
        }

        tempArr.push(informUserObj);
        return tempArr;
    }, [isNotPass, notPassReason, stageConfirm?.describes, stageConfirm?.informUserId, users.map]);

    const runStatusLabel = useMemo(() => {
        const getTitle = () => {
            const confirmResult = prop('confirmResult', stageConfirmResult);
            if (ignoreError) {
                return IGNORE_ERROR.label;
            } else if (confirmResult === CONFIRM_RESULTS.NO_PASS) {
                return NOT_PASS.label;
            } else if (confirmResult === CONFIRM_RESULTS.PASS) {
                return PASS.label;
            }
            return RUN_STATUSES.get(detail?.runStatus)?.label;

        };
        return getTitle();
    }, [detail, ignoreError, stageConfirmResult]);

    useEffect(() => {
        getUsersFromOne();
    }, []);
    return {
        timeDetails,
        consumeObj,
        operations,
        isManualConfirm,
        handleToggleNoPassReasonModal,
        noPassVisible,
        setNoPassVisible,
        confirmManualResult,
        stageTriggerItemId,
        handlePass,
        name,
        stageConfirmResult,
        manualConfirmDescContents,
        runStatusLabel,
    };
};

export default useStepCard;
