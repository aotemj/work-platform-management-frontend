import {Table, Typography} from '@osui/ui';

import cx from './index.less';
import Header from './Header';
import {ReactComponent as PrivilegeManagement} from '../../../statics/icons/Privilege-management.svg';
// import {ReactComponent as ReadyRun} from '../../../statics/icons/readyrun.svg';

import {convertConsumeTime} from '../../../utils';
import LogContent from './LogContent/index';
import {RUN_STATUSES} from '../List/constant';
import AddNoahStepDrawer from '../../Noah/AddOrEdit/AddNoahStepDrawer/index';
import useAddOrEdit from '../../Noah/AddOrEdit/hook';
import useStepLog from './hook';

const ExecLog = props => {
    const {executionDetail, getExecutionDetail} = props;

    const {Paragraph} = Typography;

    const {
        // step
        addStepDrawerVisible,
        setAddStepDrawerVisible,
        handleChangeStep,
        stepEditingValue,
        setStepEditingValue,
    } = useAddOrEdit(executionDetail);

    const {
        dataSource,
        params,
    } = useStepLog(executionDetail, getExecutionDetail);

    const sideTableProps = {
        dataSource,
        pagination: false,
        columns: [
            {
                title: '主机',
                dataIndex: 'IP',
                render(val) {
                    return <Paragraph copyable className={cx('reproducible-ip')}>{val}</Paragraph>;
                },
            },
            {
                title: '耗时',
                dataIndex: 'consumeTime',
                render(val, record) {
                    return convertConsumeTime(record);
                },
            },
            {
                // status
                width: '10%',
                title: <PrivilegeManagement />,
                dataIndex: 'runStatus',
                render(val) {
                    return <span className={cx('run-status')}>{RUN_STATUSES.get(val).icon}</span>;
                },
            },
        ],
    };

    const headerProps = {
        params,
        executionDetail,
        dataSource,
        setAddStepDrawerVisible,
    };

    const noahStepProps = {
        visible: addStepDrawerVisible,
        setVisible: setAddStepDrawerVisible,
        onClose: () => setAddStepDrawerVisible(false),
        handleChangeStep,
        stepEditingValue,
        setStepEditingValue,
        editing: false,
        isViewing: true,
    };

    return (
        <div className={cx('step-log')}>
            <Header {...headerProps} />
            <div className={cx('bottom')}>
                <div className={cx('side-bar')}>
                    <div className={cx('title')}>详情</div>
                    <Table {...sideTableProps} />
                </div>
                <div className={cx('log-content')}>
                    <LogContent dataSource={dataSource} />
                </div>
            </div>
            <AddNoahStepDrawer {...noahStepProps} />
        </div>
    );
};

export default ExecLog;
