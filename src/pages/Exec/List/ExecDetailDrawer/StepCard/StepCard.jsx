/**
 * 作业执行步骤卡片 StepCard
 */
//  1：待执行；未开始、执行暂停（如果某步骤执行失败，之后的步骤变成执行暂停）
//  2：执行中；执行中、待确认（对于人工确认步骤，执行中状态展示待确认文本）
//  3：执行失败；执行失败
//  4：执行成功：执行成功

import React, {useMemo} from 'react';
import {Button} from '@osui/ui';

import cx from './index.less';
import useStepCard from './hook';
import NoPassReasonModal from './NoPassReasonModal';

const StepCard = props => {
    const {users, detail, getUsersFromOne, submitCallback} = props;

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
    } = useStepCard({detail, getUsersFromOne, submitCallback, users});

    // 运行状态
    const runStatus = useMemo(() => {
        // TODO 运行状态未联调
        return (
            <div className={cx('exec-status')}>
                <span className={cx('exec-step-card', `status-${detail?.runStatus}`)}>
                    {runStatusLabel}
                </span>
            </div>
        );
    }, [detail?.runStatus, runStatusLabel]);

    const TimeItem = ({item}) => {
        return (
            <span className={cx('exec-step-card-grid')}>
                <span className={cx('exec-step-card-key')}>{item?.label}</span>
                <span className={cx('exec-step-card-value')}>{item?.value}</span>
            </span>
        );
    };

    const BottomContent = () => {
        const ManualConfirmContent = () => {

            return (
                <div className={cx('desc-container')}>
                    {
                        manualConfirmDescContents.map(item => {
                            return (
                                <div className={cx('desc-item')} key={item?.label}>
                                    <span className={cx('label')}>{item?.label}</span>
                                    <span className={cx('value')}>{item?.value}</span>
                                </div>
                            );
                        })
                    }

                    {!stageConfirmResult && (
                        <div className={cx('operations')}>
                            <Button
                                danger
                                className={cx('deny-button')}
                                onClick={handleToggleNoPassReasonModal}
                            >不通过
                            </Button>
                            <Button type="primary" className={cx('confirm-button')} onClick={handlePass}>通过</Button>
                        </div>
                    )}
                </div>
            );
        };
        const ContentExceptManualConfirm = () => {
            return (
                <> <TimeItem item={consumeObj} />

                    <div className={cx('right')}>
                        {
                            operations.map(operation => {
                                return (
                                    <Button
                                        type={'link'}
                                        key={operation.label}
                                        onClick={operation.execution}
                                    >{operation.label}
                                    </Button>
                                );
                            })
                        }
                    </div>
                </>
            );
        };

        return (
            <div className={cx('bottom')}>
                {
                    isManualConfirm ? (
                        <ManualConfirmContent />
                        )
                        : (
                            <ContentExceptManualConfirm />
                        )
                }
            </div>
        );
    };
    const noPassReasonProps = {
        visible: noPassVisible,
        setVisible: setNoPassVisible,
        confirmManualResult,
        stageTriggerItemId,
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
                            {
                                timeDetails.map(item => {
                                    return (<TimeItem item={item} key={item?.label} />);
                                })
                            }
                        </div>
                        <BottomContent />
                    </div>
                </div>
            </div>
            <NoPassReasonModal {...noPassReasonProps} />
        </div>
    );
};
export default StepCard;
