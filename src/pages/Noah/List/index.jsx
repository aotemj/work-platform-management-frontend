/**
 * 作业平台 作业管理 列表
 */
import React from 'react';
import cx from './index.less';
import {Table, Button, PageHeader, Spin} from '@osui/ui';
import useNoahList from './hook';
import {formatTimeStamp} from '../../../utils';
import OperationBar from './OperationBar';
import {omit} from 'ramda';

const title = '作业管理';

const NoahList = () => {
    const {
        data,
        handlePaginationChange,
        handleChange,
        loading,
        selectedRowKeys,
        onSelectChange,
        handleMenuClick,
        // 执行作业
        executeNoah,
        // 编辑作业
        editNoah,
        // 删除作业
        removeNoah,
        handleChangeInput,
        noahTypes,
        noahType,
        // onNoahSelectClear,
    } = useNoahList();
    const tableOperations = [
        {
            label: '执行',
            execution: executeNoah,
        },
        {

            label: '编辑',
            execution: editNoah,
        },
        {

            label: '删除',
            execution: removeNoah,
        },
    ];

    const columns = [
        {
            title: '作业名',
            dataIndex: 'name',
        },
        {
            title: '分类',
            align: 'center',
            dataIndex: 'affiliated',
        },
        {
            title: '创建人',
            align: 'center',
            dataIndex: 'type',
        },
        {
            title: '创建时间',
            align: 'center',
            dataIndex: 'createTime',
            render(text) {
                return formatTimeStamp(text);
            },
        },
        {
            title: '更新时间',
            align: 'center',
            dataIndex: 'updateTime',
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

    const rowSelection = {
        selectedRowKeys,
        preserveSelectedRowKeys: true,
        onChange: onSelectChange,
    };
    const tableProps = {
        // dataSource: list,
        dataSource: [{
            id: '1',
            key: '1',
            name: 'test1',
            affiliated: 'test2',
            type: 'test1',
            createTime: new Date().getTime(),
            updateTime: new Date().getTime(),
        }, {
            id: '2',
            key: '2',
            name: 'test1',
            type: 'test2',
            affiliated: 'test2',
            createTime: new Date().getTime(),
            updateTime: new Date().getTime(),
        }],
        columns,
        pagination: {
            ...omit('list', data),
            onChange: handlePaginationChange,
        },
        rowSelection,
    };
    const operationBarProps = {
        noahType,
        noahTypes,
        handleChange,
        handleChangeInput,
        handleMenuClick,
        // onClear: onNoahSelectClear,
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
