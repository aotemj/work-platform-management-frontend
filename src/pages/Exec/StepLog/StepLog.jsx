import {Table, Typography, Spin} from '@osui/ui';

import cx from './index.less';
import Header from './Header';

import {convertConsumeTime} from '../../../utils';
import LogContent from './LogContent/index';
import {FAILED, RUN_STATUSES} from '../List/constant';
import AddNoahStepDrawer from '../../Noah/AddOrEdit/AddNoahStepDrawer/index';
import useAddOrEdit from '../../Noah/AddOrEdit/hook';
import useStepLog from './hook';

const ExecLog = ({
    executionDetail,
    getExecutionDetail,
    users,
    getNoahWorkPlanDetail,
    noahDetail,
    getCategoryList,
    updateNoahDetail,
    categories,
    categoryMap,
}) => {
    const {Paragraph} = Typography;

    const {
        // step
        addStepDrawerVisible,
        setAddStepDrawerVisible,
        handleChangeStep,
        stepEditingValue,
        setStepEditingValue,
    } = useAddOrEdit({
        getNoahWorkPlanDetail,
        noahDetail,
        executionDetail,
        getCategoryList,
        updateNoahDetail,
        categories,
        categoryMap,
    });

    const {
        dataSource,
        params,
        errorInfo,
        loading,
        setLoading,
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
                align: 'center',
                render(val, record) {
                    return convertConsumeTime(record);
                },
            },
            {
                // status
                width: '15%',
                title: '状态',
                dataIndex: 'allTaskSuccess',
                render(val, record) {
                    // 由于当前存在合并主机情况，所以需要先判断是否全部任务成功(allTaskSuccess 为 true)， 如果不成功则显示失败
                    const {runStatus} = record;
                    return (
                        <span className={cx('run-status')}>
                            {RUN_STATUSES.get(val ? runStatus : FAILED.value).icon}
                        </span>
                    );
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
        users,
    };
    return (
        <Spin spinning={loading}>
            <div className={cx('step-log')}>
                <Header {...headerProps} />
                <div className={cx('bottom')}>
                    <div className={cx('side-bar')}>
                        <h3 className={cx('title')}>详情</h3>
                        <Table {...sideTableProps} />
                    </div>
                    <div className={cx('log-content')}>
                        <LogContent
                            dataSource={dataSource}
                            errorInfo={errorInfo}
                            updateLoading={setLoading}
                        />
                    </div>
                </div>
                <AddNoahStepDrawer {...noahStepProps} />
            </div>
        </Spin>
    );
};

export default ExecLog;
