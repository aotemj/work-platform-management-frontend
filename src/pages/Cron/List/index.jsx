/**
 * 定时任务列表
 */
import React from 'react';
import {Table, Button, PageHeader, Spin, Switch} from '@osui/ui';
import {omit, propOr, prop} from 'ramda';
import {useDispatch, useSelector} from 'react-redux';

import cx from './index.less';
import useCronList from './hook';
import {formatTimeStamp, generateDispatchCallback} from '../../../utils';
import OperationBar from './OperationBar';
import StatusTag from '../../../components/StatusTag';
import AddOrEditCron from './AddOrEditCron';
import CronRecord from './CronRecord';
import {DEFAULT_STRING_VALUE} from '../../../constant';
import {STRATEGIES_TYPES} from '../constant';
import EllipsisContainer from '../../../components/EllipsisContainer';
import {updateDiskSpaceInfo} from '../../../reduxSlice/diskSpace/diskSpaceSlice';

const title = '定时任务';

const Index = () => {

    const dispatch = useDispatch();
    const diskSpaceInfo = useSelector(state => state.diskSpace);

    const {
        data,
        loading,
        handleChangeInput,
        handleChangeDate,
        handlePaginationChange,
        addOrEditDrawerVisible,
        setAddOrEditDrawerVisible,
        handleAddCron,
        deleteCron,
        handleChangeCronByManual,
        editCron,
        editing,
        editDetailId,
        cronRecordVisible,
        setCronRecordVisible,
        recordId,
        toggleCronRecord,
    } = useCronList({
        diskSpaceInfo,
        updateDiskSpaceInfo: generateDispatchCallback(dispatch, updateDiskSpaceInfo),
    });

    const tableOperations = [
        {
            label: '执行记录', execution: toggleCronRecord,
        },
        {

            label: '编辑', execution: editCron,
        },
        {

            label: '删除', execution: deleteCron,
        },
    ];

    const columns = [
        {
            title: 'ID',
            render: (_, record) => prop('id', record?.cronExecute),
        },
        {
            title: '任务名称',
            dataIndex: 'cronExecute',
            render: val => {
                const value = propOr(DEFAULT_STRING_VALUE, 'taskName', val);
                return <EllipsisContainer val={value} />;
            },
        },
        {
            title: '作业名称',
            dataIndex: 'workPlanName',
            render: val => <EllipsisContainer val={val} />,
        },
        {
            title: '策略类型',
            dataIndex: 'cronExecute',
            ellipsis: true,
            render: val => STRATEGIES_TYPES.get(val?.exePolicy)?.label,
        },
        {
            title: '更新人',
            ellipsis: true,
            dataIndex: 'cronExecute',
            render: val => propOr(DEFAULT_STRING_VALUE, 'userName', val),
        },
        {
            title: '最新执行结果',
            dataIndex: 'latestWorkTrigger',
            align: 'center',
            ellipsis: true,
            render(status) {
                if (!status) {
                    return <StatusTag status={1} />;
                }
                return <StatusTag status={prop('runStatus', status)} />;
            },
        },
        {
            title: '最近执行时间',
            dataIndex: 'latestWorkTrigger',
            align: 'center',
            ellipsis: true,
            render: val => formatTimeStamp(prop('beginTime', val)),
        },
        {
            title: '操作',
            width: 220,
            align: 'center',
            render: (_, record) => {
                const {
                    cronExecute: {
                        exeStatus,
                        // cronExecute下面的openStatus，0表示不启用，1表示启用
                        openStatus,
                    } = null,
                } = record;
                /*
                任务停用启用逻辑 from product manager
                6.1 周期性任务可以正常停用和启用
                6.2 单次任务在任务没有执行前，可以停用。在任务执行完毕无能在启用
            */
                return (
                    <div className={cx('operation-item')}>
                        <Switch
                            checked={!!openStatus}
                            checkedChildren="停用"
                            unCheckedChildren="启用"
                            disabled={exeStatus}
                            onChange={e => handleChangeCronByManual(e, record)}
                        />
                        {tableOperations.map(item => {
                            const {label, execution} = item;
                            return (
                                <Button
                                    key={label}
                                    type={'link'}
                                    className={cx('operation-button')}
                                    onClick={() => execution(record)}
                                >{label}
                                </Button>
                            );
                        })}
                    </div>
                );
            },
        }];

    const tableProps = {
        dataSource: data.list,
        columns,
        rowKey: 'id',
        pagination: {
            ...omit(['list'], data),
            onChange: handlePaginationChange,
        },
    };
    const operationBarProps = {
        handleChangeInput, handleChangeDate, handleAddCron,
    };
    const addOrEditCron = {
        visible: addOrEditDrawerVisible,
        setVisible: setAddOrEditDrawerVisible,
        onClose: () => {
            setAddOrEditDrawerVisible(false);
        },
        editDetailId,
        editing,
    };

    const cronRecordProps = {
        visible: cronRecordVisible,
        recordId,
        onClose: () => {
            setCronRecordVisible(false);
        },
    };
    return (
        <div className={cx('cron-container')}>
            <PageHeader title={title} className={cx('title')} />
            <OperationBar {...operationBarProps} />
            <Spin spinning={loading}>
                <Table {...tableProps} />
            </Spin>
            {/* 新增、 编辑 cron */}
            <AddOrEditCron {...addOrEditCron} />
            {/* 执行记录 */}
            <CronRecord {...cronRecordProps} />
        </div>
    );
};

export default Index;
