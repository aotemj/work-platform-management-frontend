/**
 * 定时任务列表
 */
import React from 'react';
import {Table, Button, PageHeader, Spin, Switch} from '@osui/ui';
import {omit, propOr, prop} from 'ramda';

import cx from './index.less';
import useCronList from './hook';
import {formatTimeStamp} from '../../../utils';
import OperationBar from './OperationBar';
import StatusTag from '../../../components/StatusTag';
import AddOrEditCron from './AddOrEditCron';
import CronRecord from './CronRecord';
import {DEFAULT_STRING_VALUE} from '../../../constant';
import {STRATEGIES_TYPES} from '../constant';

const title = '定时任务';

const CronList = props => {
    const {
        noahList, noahTotal, noahDetail, categories, categoryMap, getNoahList, getNoahWorkPlanDetail,
    } = props;
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
    } = useCronList();

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
            title: 'id',
            render: (_, record) => {
                return record.cronExecute.id;
            },
        },
        {
            title: '任务名称',
            dataIndex: 'cronExecute',
            render(val) {
                return propOr(DEFAULT_STRING_VALUE, 'taskName', val);
            },
        },
        {
            title: '作业名称',
            dataIndex: 'workPlanName',
        },
        {
            title: '策略类型',
            dataIndex: 'cronExecute',
            render: val => {
                return STRATEGIES_TYPES.get(val?.exePolicy)?.label;
            },
        },
        {
            title: '更新人',
            dataIndex: 'cronExecute',
            render: val => {
                return propOr(DEFAULT_STRING_VALUE, 'userName', val);
            },
        },
        {
            title: '最新执行结果',
            dataIndex: 'latestWorkTrigger',
            align: 'center',
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
            render(val) {
                return formatTimeStamp(prop('beginTime', val));
            },
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
        dataSource: data.list, columns, rowKey: 'id', pagination: {
            ...omit(['list'], data), showSizeChanger: true, showQuickJumper: true, onChange: handlePaginationChange,
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
        noahList,
        noahTotal,
        noahDetail,
        categories,
        categoryMap,
        getNoahList,
        getNoahWorkPlanDetail,
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
            <Spin spinning={loading} size="large">
                <Table {...tableProps} />
            </Spin>
            {/* 新增、 编辑 cron */}
            <AddOrEditCron {...addOrEditCron} />
            {/* 执行记录 */}
            <CronRecord {...cronRecordProps} />
        </div>
    );
};

export default CronList;
