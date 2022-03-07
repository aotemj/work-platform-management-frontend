/**
 * 作业认为查看 Drawer
 */

import React from 'react';
import {Drawer, Steps, Input, Select, Tooltip, Radio, InputNumber} from '@osui/ui';
import {UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';
import {ReactComponent as CheckCircle} from '../../../../statics/icons/checkcircle.svg';// 初始化、执行成功
import {ReactComponent as CloseCircle} from '../../../../statics/icons/closecircle.svg';// 执行失败
import {ReactComponent as NotStarted} from '../../../../statics/icons/notstarted.svg';// 待确认
import {ReactComponent as ReadyRun} from '../../../../statics/icons/readyrun.svg';// 未开始
import {ReactComponent as Running} from '../../../../statics/icons/running.svg';// 执行中
import {ReactComponent as Suspend} from '../../../../statics/icons/suspend.svg';// 执行暂停
import StepCard from './StepCard';
import cx from './index.less';

const {Step} = Steps;

const ExecViewStepDrawer = ({onClose, visible, handleChangeStep}) => {
    return (
        <Drawer
            title="作业XXX的执行详情"
            width={720}
            placement="right"
            onClose={onClose}
            visible={visible}
        >
            <div className={cx('exec-viewstep-header')}>
                <span className={cx('exec-viewstep-header-content')}>
                    <span className={cx('exec-viewstep-header-content-title')}>发起人：</span>
                    <span className={cx('exec-viewstep-header-content-text')}>张三</span>
                </span>
                <span className={cx('exec-viewstep-header-content')}>
                    <span className={cx('exec-viewstep-header-content-title')}>发起时间：</span>
                    <span className={cx('exec-viewstep-header-content-text')}>2022-06-07 17:47:20</span>
                </span>
                <span className={cx('exec-viewstep-header-content')}>
                    <span className={cx('exec-viewstep-header-content-title')}>状态：</span>
                    <span className={cx('exec-viewstep-header-content-text')}>执行失败</span>
                </span>
                <span className={cx('exec-viewstep-header-content')}>
                    <span className={cx('exec-viewstep-header-content-title')}>总耗时：</span>
                    <span className={cx('exec-viewstep-header-content-text')}>1h23m33s</span>
                </span>
            </div>
            <Steps direction="vertical" className={cx('exec-viewstep-content')}>
                <Step status="finish" title={<StepCard />} icon={<CheckCircle />} />
                <Step status="finish" icon={<CloseCircle />} />
                <Step status="finish" icon={<NotStarted />} />
                <Step status="finish" icon={<ReadyRun />} />
                <Step status="finish" icon={<Running />} />
                <Step status="finish" icon={<Suspend />} />

            </Steps>
        </Drawer>
    );
};
export default ExecViewStepDrawer;
