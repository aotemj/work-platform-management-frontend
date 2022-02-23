/**
 * 执行历史 作业任务列表
 */
import React from 'react';
import cx from './index.less';
import {Table, Button, PageHeader, Spin} from '@osui/ui';
import useNoahList from './hook';
import {formatTimeStamp} from '../../../utils';
import OperationBar from './OperationBar';
import {omit} from 'ramda';

const title = '作业任务';

const NoahList = () => {
    const {
        data,
        handlePaginationChange,
        loading,
        executeNoah,
        // 编辑作业
        editNoah,
        // 删除作业
        handleChangeInput,
    } = useNoahList();
    const tableOperations = [
        {
            label: '重新执行',
            execution: executeNoah,
        },
        {

            label: '查看',
            execution: editNoah,
        },
    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '名称',
            align: 'center',
            dataIndex: 'name',
        },
        {
            title: '发起人',
            align: 'center',
            dataIndex: 'initiator',
        },
        {
            title: '任务状态',
            align: 'center',
            dataIndex: 'status',
        },
        {
            title: '发起时间',
            align: 'center',
            dataIndex: 'createTime',
            render(text) {
                return formatTimeStamp(text);
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            headerAlign: 'center',
            align: 'right',
            render: (_, record) => {
                return tableOperations.map(item => {
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
                });
            },
        },
    ];

    const tableProps = {
        dataSource: [
            {
                id: '1',
                key: '1',
                name: 'test1',
                initiator: '张三',
                status: '等待中',
                createTime: new Date().getTime(),
            },
            {
                id: '2',
                key: '2',
                name: 'test2',
                initiator: '李四',
                status: '成功',
                createTime: new Date().getTime(),
            },
            {
                id: '2',
                key: '2',
                name: 'test2',
                initiator: '李四',
                status: '等待',
                createTime: new Date().getTime(),
            },
            {
                id: '2',
                key: '2',
                name: 'test2',
                initiator: '李四',
                status: '失败',
                createTime: new Date().getTime(),
            },
        ],
        columns,
        pagination: {
            ...omit('list', data),
            onChange: handlePaginationChange,
        },
    };
    const operationBarProps = {
        handleChangeInput,
    };
    return (
        <div className={cx('noah-container')}>
            <PageHeader title={title} className={cx('title')} />
            <OperationBar {...operationBarProps} />
            <Spin spinning={loading} size="large">
                <Table {...tableProps} />
            </Spin>
        </div>
    );
};

export default NoahList;
