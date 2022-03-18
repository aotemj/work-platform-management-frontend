import {useCallback, useEffect, useMemo, useState} from 'react';
import {message, Modal} from '@osui/ui';

import {formatTimeStamp, getContainerDOM, getDateTime} from '../../../../../utils';
import {
    DEFAULT_STRING_VALUE,
    REQUEST_CODE,
    REQUEST_METHODS,
    SPLIT_SYMBOL,
    STEP_TYPES,
    URL_PREFIX1,
} from '../../../../../constant';
import {CONFIRM_RESULTS, FAILED, IGNORE_ERROR, NOT_PASS, PASS, RUN_STATUSES, URLS} from '../../constant';
import {request} from '../../../../../request/fetch';
import {useNavigate} from 'react-router-dom';
import {routes} from '../../../../../routes';

const useStepCard = ({detail, getUsersFromOne, submitCallback, users}) => {
    const navigate = useNavigate();
    const [noPassVisible, setNoPassVisible] = useState(false);
    const name = useMemo(() => {
        return detail?.name;
    }, [detail]);
    // TODO 忽略错误暂未调试 交互
    // 忽略错误
    const neglectErrors = useCallback(() => {
        const {id} = detail;
        const res = request({
            url: `${URL_PREFIX1}${URLS.NEGLECT_ERRORS}${id}`,
            method: REQUEST_METHODS.POST,
        });
        // console.log(res);
    }, [detail]);
    // 失败IP重试 暂时隐藏，后期迭代
    // const reTryWithFailedIPs = useCallback(() => {
    //
    // }, []);
    // 全部IP重试
    const entirelyRetry = useCallback(() => {
        const {id} = detail;
        const res = request({
            url: `${URL_PREFIX1}${URLS.ENTIRELY_RE_EXECUTE}${id}`,
            method: REQUEST_METHODS.POST,
        });
        // console.log(res);
    }, [detail]);
    const viewLog = useCallback(() => {
        const {id} = detail;
        navigate(routes.EXEC_LOG.getUrl(id));
    }, [detail, navigate]);
    // NOTE  步骤类型
    //  人工确认  类型没有 结束时间
    const type = useMemo(() => {
        return detail?.type;
    }, [detail]);

    const stageTriggerItemParams = useMemo(() => {
        return detail?.stageTriggerItemList[0]?.stageTriggerItemParams;
    }, [detail]);

    const stageTriggerItemId = useMemo(() => {
        return detail?.stageTriggerItemList[0]?.id;
    }, [detail?.stageTriggerItemList]);

    // 是否忽略错误
    const ignoreError = useMemo(() => {
        return detail?.ignoreError;
    }, [detail]);

    // 人工确认相关参数
    const stageConfirm = useMemo(() => {
        return stageTriggerItemParams?.stageConfirm;
    }, [stageTriggerItemParams]);
    // 人工确认结果（不通过或通过）
    const stageConfirmResult = useMemo(() => {
        return stageTriggerItemParams?.stageConfirmResult;
    }, [stageTriggerItemParams]);

    const isNotPass = useMemo(() => {
        return stageConfirmResult && stageConfirmResult.confirmResult === CONFIRM_RESULTS.NO_PASS;
    }, [stageConfirmResult]);

    const notPassReason = useMemo(() => {
        return stageConfirmResult?.noPassReason;
    }, [stageConfirmResult]);

    const isManualConfirm = useMemo(() => {
        return type === STEP_TYPES.MANUAL_CONFIRM.value;
    }, [type]);
    const timeDetails = useMemo(() => {
        if (!detail) {
            return [];
        }
        const {beginTime, endTime} = detail;
        const endTimeObj = {
            label: '结束时间：',
            value: formatTimeStamp(endTime),
        };
        const tempArr = [
            {
                label: '开始时间：',
                value: formatTimeStamp(beginTime),
            },
        ];
        if (!isManualConfirm) {
            tempArr.push(endTimeObj);
        }
        return tempArr;
    }, [detail, isManualConfirm]);
    const consumeObj = (() => {
        let {consumeTime, beginTime} = detail;
        // console.log(beginTime);
        if (!consumeTime && beginTime) {
            consumeTime = (Date.now() - beginTime) / 1000;
        }

        // 总耗时
        const tempConsumeTime = () => {
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
        };
        return {
            label: '耗时：',
            value: tempConsumeTime(),
        };
    })();

    const handleToggleNoPassReasonModal = useCallback((status = false) => {
        setNoPassVisible(status);
    }, []);

    const confirmManualResult = useCallback(async params => {
        // confirmResult	人工确认结果	body	true
        // confirmResult	人工确认结果 1：通过；2：不通过；		false   // integer
        // id	作业步骤任务执行记录id		false   // integer
        // noPassReason	不通过原因		false   // string
        const res = await request({
            url: `${URL_PREFIX1}${URLS.CONFIRM_MANUAL_RESULT}`,
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
        const {runStatus} = detail;

        const failedOperations = [
            {
                label: '忽略错误',
                execution: neglectErrors,
            },
            // 暂时隐藏, 后期迭代
            // {
            //     label: '失败IP重试',
            //     execution: reTryWithFailedIPs,
            // },
            {
                label: '全部IP重试',
                execution: entirelyRetry,
            },
        ];
        let tempArr = [

            {
                // TODO 日志整体逻辑
                label: '查看日志',
                execution: viewLog,
            },
        ];
        if (runStatus === FAILED.value) {
            tempArr.unshift(...failedOperations);
        }
        return tempArr;
    }, [detail, entirelyRetry, neglectErrors, viewLog]);

    const manualConfirmDescContents = useMemo(() => {
        const getInformUser = () => {
            const informUserId = stageConfirm?.informUserId;
            console.log(informUserId);
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
            if (ignoreError) {
                return IGNORE_ERROR.label;
            } else if (stageConfirmResult?.confirmResult === CONFIRM_RESULTS.NO_PASS) {
                return NOT_PASS.label;
            } else if (stageConfirmResult?.confirmResult === CONFIRM_RESULTS.PASS) {
                return PASS.label;
            }
            return RUN_STATUSES.get(detail?.runStatus)?.label;

        };
        return getTitle();
    }, [detail?.runStatus, ignoreError, stageConfirmResult?.confirmResult]);

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
