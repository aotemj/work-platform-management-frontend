/**
 * 作业任务详情查看 Drawer
 */

import {Drawer, Steps} from '@osui/ui';

import StepCard from './StepCard/index';
import cx from './index.less';
import {IGNORE_ERROR, RUN_STATUSES} from '../constant';
import useExecDetail from './hook';
import HeaderDetailItem from '../../components/HeaderDetailItem';

const {Step} = Steps;
const ExecDetailDrawer = ({onClose, visible, handleChangeStep, executionDetail, submitCallback}) => {

    const {
        title,
        headerDetail,
        stageTriggerList,
    } = useExecDetail(executionDetail);

    return (
        <Drawer
            title={title}
            width={720}
            placement="right"
            onClose={onClose}
            visible={visible}
        >
            <div className={cx('exec-viewstep-header-container')}>
                {headerDetail.map(item => (<HeaderDetailItem key={item?.label} item={item} />))}
            </div>
            <Steps direction="vertical" className={cx('exec-viewstep-content')}>
                {
                    stageTriggerList.map(stageTrigger => {
                        const icon = stageTrigger?.ignoreError
                            ? IGNORE_ERROR.icon : RUN_STATUSES.get(stageTrigger?.runStatus)?.icon;
                        return (
                            <Step
                                key={stageTrigger?.id}
                                status="finish"
                                title={(
                                    <StepCard
                                        detail={stageTrigger}
                                        submitCallback={submitCallback}
                                        executionDetail={executionDetail}
                                    />
)}
                                icon={icon}
                            />
                        );
                    })
                }

            </Steps>
        </Drawer>
    );
};
export default ExecDetailDrawer;
