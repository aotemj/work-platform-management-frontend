/**
 * 执行历史 作业任务列表
 */
import React from 'react';
import {omit} from 'ramda';
import {Table, Button, PageHeader, Spin} from '@osui/ui';

import cx from './index.less';
import useExecList from './hook';
import {formatTimeStamp} from '../../../utils';
import OperationBar from './OperationBar';
import StatusTag from '../../../components/StatusTag';
import ExecDetailDrawer from './ExecDetailDrawer';

const title = '作业任务';

const ExecList = props => {
    const {executionDetail, getExecutionDetail} = props;
    const {
        data,
        loading,
        handleChangeInput,
        handleChangeDate,
        handlePaginationChange,
        reExecution,
        handleViewDetail,
        executeDetailVisible,
        setExecuteDetailVisible,
        setCurrentExecutionId,
        // executionDetail,
        submitCallback,
    } = useExecList(getExecutionDetail);
    const tableOperations = [
        {
            label: '重新执行',
            execution: reExecution,
        },
        {

            label: '查看',
            execution: handleViewDetail,
        },
    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '作业名称',
            dataIndex: 'name',
        },
        {
            title: '发起人',
            dataIndex: 'userName',
        },
        {
            title: '任务状态',
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
            width: 170,
            render: (_, record) => {
                return (
                    <div style={{marginLeft: '-5px'}}>
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
                    </div>
                );
            },
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

    const execDetailProps = {
        visible: executeDetailVisible,
        setVisible: setExecuteDetailVisible,
        onClose: () => {
            setCurrentExecutionId(null);
            setExecuteDetailVisible(false);
        },
        handleChangeStep: () => {},
        executionDetail,
        submitCallback,
    };

    return (
        <div className={cx('noah-container')}>
            <PageHeader title={title} className={cx('title')} />
            <OperationBar {...operationBarProps} />
            <Spin spinning={loading} size="large">
                <Table {...tableProps} />
            </Spin>
            <ExecDetailDrawer {...execDetailProps} />
        </div>
    );
};

export default ExecList;
