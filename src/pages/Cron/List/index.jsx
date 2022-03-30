/**
 * 定时任务列表
 */
import React from 'react';
import cx from './index.less';
import {Table, Button, PageHeader, Spin, Switch} from '@osui/ui';
import useCronList from './hook';
import {formatTimeStamp} from '../../../utils';
import OperationBar from './OperationBar';
import StatusTag from '../../../components/StatusTag';
import {omit} from 'ramda';
import AddOrEditCron from './AddOrEditCron/index';
import {STRATEGIES_TYPES} from '../constant';

const title = '定时任务';

const CronList = () => {
    const {
        data,
        loading,
        handleChangeInput,
        handleChangeDate,
        handlePaginationChange,
    } = useCronList();
    const tableOperations = [
        {
            label: '执行记录',
            execution: null,
        },
        {

            label: '编辑',
            execution: null,
        },
        {

            label: '删除',
            execution: null,
        },
    ];

    const columns = [
        {
            title: '任务名称',
            dataIndex: 'id',
        },
        {
            title: '作业名称',
            dataIndex: 'name',
        },
        {
            title: '策略类型',
            dataIndex: 'exePolicy',
            render: val => {
                return STRATEGIES_TYPES.get(val);
            },
        },
        {
            title: '更新人',
            dataIndex: 'userName',
        },
        {
            title: '最新执行结果',
            dataIndex: 'status',
            render(status) {
                return <StatusTag status={status} />;
            },
        },
        {
            title: '发起时间',
            dataIndex: 'beginTime',
            render(time) {
                return formatTimeStamp(time);
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: 220,
            render: (_, record) => (
                <div style={{marginLeft: '-5px'}}>
                    <>
                        {
                            tableOperations.map(item => {
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
                            })
                        }
                        <Switch defaultChecked />
                    </>
                </div>
            ),
        },
    ];

    const tableProps = {
        dataSource: data.list,
        columns,
        rowKey: 'id',
        pagination: {
            ...omit(['list'], data),
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: handlePaginationChange,
        },
    };
    const operationBarProps = {
        handleChangeInput,
        handleChangeDate,
    };

    const addOrEditCron = {
        visible: true,
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
        </div>
    );
};

export default CronList;
