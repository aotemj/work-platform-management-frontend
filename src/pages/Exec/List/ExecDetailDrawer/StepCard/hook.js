import {useCallback, useEffect, useMemo, useState} from 'react';
import {Modal} from '@osui/ui';
import {prop} from 'ramda';
import {useNavigate} from 'react-router-dom';

import {
    assembleRequestUrl,
    convertConsumeTime,
    formatTimeStamp,
    generateFullPath,
    getContainerDOM,
    Toast,
} from '../../../../../utils';
import {
    DEFAULT_STRING_VALUE,
    DEFAULT_SUCCESS_MESSAGE,
    REQUEST_CODE,
    REQUEST_METHODS,
    SPLIT_SYMBOL,
    STEP_TYPES,
} from '../../../../../constant';
import {
    CONFIRM_RESULTS, FAILED,
    IGNORE_ERROR, NOT_PASS,
    PASS, RUN_STATUSES,
    SUCCESS, URLS,
} from '../../constant';
import {request} from '../../../../../request/fetch';
import {routes} from '../../../../../routes';
import {entirelyRetry, neglectErrors} from '../util';

const useStepCard = ({
    detail,
    updateUserFromOne,
    submitCallback,
    users,
    executionDetail,
    updateCurrentUser,
}) => {
    const navigate = useNavigate();
    const [noPassVisible, setNoPassVisible] = useState(false);

    const name = prop('name', detail);

    const [confirmLoading, setConfirmLoading] = useState(false);
    // 失败IP重试 暂时隐藏，后期迭代
    // const reTryWithFailedIPs = () => {
    //
    // };

    const viewLog = () => {
        const {id: executeId, workPlanId: detailId} = executionDetail;
        const {id: stepId} = detail;

        navigate(generateFullPath(routes.EXEC_LOG.path, {detailId, executeId, stepId}));
    };

    // NOTE  步骤类型
    //  人工确认  类型没有 结束时间
    const type = prop('type', detail);

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
        setConfirmLoading(true);
        const res = await request({
            url: assembleRequestUrl(URLS.CONFIRM_MANUAL_RESULT),
            method: REQUEST_METHODS.POST,
            params,
        });
        const {code} = res;
        setConfirmLoading(false);
        if (code === REQUEST_CODE.SUCCESS) {
            Toast.success(DEFAULT_SUCCESS_MESSAGE);
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
    }, []);

    const operations = useMemo(() => {
        const {runStatus, ignoreError} = detail;

        const ignoreErrorObj = {
            label: '忽略错误',
            execution: detail => neglectErrors(detail, navigate),
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
                execution: detail => entirelyRetry(detail, navigate),
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

    const getInformUser = () => {
        const informUserId = stageConfirm?.informUserId;
        if (!informUserId) {
            return [DEFAULT_STRING_VALUE];
        }
        const ids = informUserId.split(SPLIT_SYMBOL);
        if (ids) {
            return ids.map(id => {
                return users.map[id] || null;
            }).filter(item => item);
        }
    };

    const informUserNames = getInformUser().map(item => item?.enterpriseCard).join(SPLIT_SYMBOL);

    const informUserIds = getInformUser().map(item => item?.userId);

    const manualConfirmDescContents = useMemo(() => {

        const informUserObj = {
            label: '确认人：',
            value: informUserNames,
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
    }, [informUserNames, isNotPass, notPassReason, stageConfirm?.describes]);

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
        updateUserFromOne({});
        updateCurrentUser();
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
        confirmLoading,
        informUserIds,
    };
};

export default useStepCard;
