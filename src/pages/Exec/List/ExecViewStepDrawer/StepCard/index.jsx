/**
 * 作业执行步骤卡片 StepCard
 */
//  1：待执行；未开始、执行暂停（如果某步骤执行失败，之后的步骤变成执行暂停）
//  2：执行中；执行中、待确认（对于人工确认步骤，执行中状态展示待确认文本）
//  3：执行失败；执行失败
//  4：执行成功：执行成功

import React from 'react';
import cx from './index.less';

const StepCard = () => {
    return (
        <div className={cx('exec-step-card')}>
            {/* 初始化 */}
            {/* <div className={cx('exec-step-card-content')}>
                <div className={cx('exec-step-card-content-title')}>初始化</div>
                <div className={cx('exec-step-card-content-context')}>
                    <span className={cx('exec-step-card-key')}>初始化开始时间：</span>
                    <span className={cx('exec-step-card-value')}>2021-11-07 17:47:20</span>
                </div>
            </div> */}
            {/* 执行成功 */}
            <div className={cx('exec-step-card-content')}>
                <div className={cx('exec-step-card-content-title')}>步骤1：XXXXXX脚本执行_123123123</div>
                <div className={cx('exec-step-card-content-flex')}>
                    <div className={cx('exec-step-card-content-flex-left')}>
                        <span className={cx('exec-step-card-sucess')}>执行成功</span>
                    </div>
                    <div className={cx('exec-step-card-content-flex-right')}>
                        <div>
                            <span className={cx('exec-step-card-grid')}>
                                <span className={cx('exec-step-card-key')}>开始时间：</span>
                                <span className={cx('exec-step-card-value')}>2021-11-07 17:47:20</span>
                            </span>
                            <span>
                                <span className={cx('exec-step-card-key')}>结束时间：</span>
                                <span className={cx('exec-step-card-value')}>2021-11-07 17:47:20</span>
                            </span>
                        </div>
                        <div className={cx('exec-step-card-flex')}>
                            <div>
                                <span>
                                    <span className={cx('exec-step-card-key')}>耗时：</span>
                                    <span className={cx('exec-step-card-value')}>1h 23m 33s</span>
                                </span>
                            </div>
                            <div>
                                <span className={cx('exec-step-btn-primary')}>查看日志</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StepCard;
