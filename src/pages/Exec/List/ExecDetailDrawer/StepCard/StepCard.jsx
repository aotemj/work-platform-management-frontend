/**
 * 作业执行步骤卡片 StepCard
 */

/**
 1：待执行；未开始、执行暂停（如果某步骤执行失败，之后的步骤变成执行暂停）
 2：执行中；执行中、待确认（对于人工确认步骤，执行中状态展示待确认文本）
 3：执行失败；执行失败
 4：执行成功：执行成功
 */
import React, {useMemo} from 'react';
import {propOr} from 'ramda';
import {useDispatch, useSelector} from 'react-redux';

import cx from './index.less';
import useStepCard from './hook';
import NoPassReasonModal from './NoPassReasonModal';
import {IGNORE_ERROR} from '../../constant';
import TimeItem from './TimeItem';
import ManualConfirmContent from './ManualConfirmContent';
import ContentExceptManualConfirm from './ContentExceptManualConfirm';
import {updateUserFromOne} from '../../../../../reduxSlice/uesr/userSlice';
import {generateDispatchCallback} from '../../../../../utils';
import {updateCurrentUser} from '../../../../../reduxSlice/uesr/currentUserSlice';

const StepCard = ({
    detail,
    submitCallback,
    stepId,
}) => {

    const dispatch = useDispatch();
    const users = useSelector(state => state.users);
    const currentUser = useSelector(state => state.currentUser);
    const executionDetail = useSelector(state => state.executionDetail);

    const {
        consumeObj,
        isManualConfirm,
        operations,
        timeDetails,
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
    } = useStepCard({
        detail,
        updateUserFromOne: generateDispatchCallback(dispatch, updateUserFromOne),
        submitCallback,
        users,
        executionDetail,
        updateCurrentUser: generateDispatchCallback(dispatch, updateCurrentUser),
    });

    // 运行状态
    const runStatus = useMemo(() => {
        const stageTriggerItemList = propOr([], 'stageTriggerItemList', detail);

        let hasOvertime = false;
        const length  = stageTriggerItemList.length;
        for (let i = 0; i < length; i++) {
            const item = stageTriggerItemList[i];
            if (item?.hasOvertime === 1) {
                hasOvertime = true;
                break;
            }
        }

        return (
            <div className={cx('exec-status')}>
                <span
                    className={cx(
                        'exec-step-card',
                        `status-${detail?.ignoreError
                            ? IGNORE_ERROR.styleLabel : detail?.runStatus}`,
                    )}
                >
                    {hasOvertime ? '执行超时' : runStatusLabel}
                </span>
            </div>
        );
    }, [detail, runStatusLabel]);

    const noPassReasonProps = {
        visible: noPassVisible,
        setVisible: setNoPassVisible,
        confirmManualResult,
        stageTriggerItemId,
    };

    const manualConfirmProps = {
        informUserIds,
        currentUser,
        stageConfirmResult,
        detail,
        manualConfirmDescContents,
        confirmLoading,
        handleToggleNoPassReasonModal,
        handlePass,
    };

    const contentExceptManualConfirmProps = {
        consumeObj,
        operations,
        stepId,
    };

    return (
        <div className={cx('exec-step-card')}>
            {/* 执行成功 */}
            <div className={cx('exec-step-card-content')}>
                <div className={cx('exec-title')}>{name}</div>
                <div className={cx('main-content')}>
                    {/* 执行状态 */}
                    {runStatus}
                    <div className={cx('right')}>
                        <div className={cx('top')}>
                            {timeDetails.map(item => <TimeItem item={item} key={item?.label} />)}
                        </div>
                        <div className={cx('bottom')}>
                            {isManualConfirm
                                ? <ManualConfirmContent {...manualConfirmProps} />
                                : <ContentExceptManualConfirm {...contentExceptManualConfirmProps} />}
                        </div>
                    </div>
                </div>
            </div>
            <NoPassReasonModal {...noPassReasonProps} />
        </div>
    );
};
export default StepCard;
