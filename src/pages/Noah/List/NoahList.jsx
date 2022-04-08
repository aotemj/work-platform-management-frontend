/**
 * 作业平台 作业管理 列表
 */
import React from 'react';
import {Table, PageHeader, Button, Spin, Tooltip, Tag} from '@osui/ui';
import {omit} from 'ramda';

import cx from './index.less';
import useNoahList from './hook';
import {formatTimeStamp} from '../../../utils';
import OperationBar from './OperationBar';
import {MAX_DISPLAY_LENGTH, SPLIT_SYMBOL} from '../../../constant';

const title = '作业管理';

const NoahList = props => {
    const {getNoahList, noahList, noahTotal, updateDiskSpaceInfo, diskSpaceInfo} = props;
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
        addNoah,
        setNoahType,
        batchSpin,
    } = useNoahList({getNoahList, noahList, noahTotal, updateDiskSpaceInfo, diskSpaceInfo});

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
            width: '10%',
            render: val => {
                return (
                    <Tooltip title={val}>
                        <span className={cx('noah-name')}>
                            {val}
                        </span>
                    </Tooltip>
                );
            },
        },
        {
            title: '分类',
            align: 'center',
            dataIndex: 'typeNames',
            render: val => {
                const types = val?.split(SPLIT_SYMBOL) || [];
                const renderTag = type => {
                    return <Tag key={type}>{type}</Tag>;
                };
                if (types.length > MAX_DISPLAY_LENGTH) {
                    return (
                        <Tooltip title={val}>
                            {types.slice(0, MAX_DISPLAY_LENGTH).map(renderTag)}
                            <Tag>...</Tag>
                        </Tooltip>
                    );
                } else if (types.length > 0) {
                    return types.map(renderTag);
                }

                return '未分类';
            },
        },
        {
            title: '创建人',
            align: 'center',
            dataIndex: 'userName',
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
        dataSource: data.list,
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
        addNoah,
        setNoahType,
    };
    return (
        <Spin spinning={batchSpin} tip={'正在批量操作，请稍后'} size={'large'}>
            <div className={cx('noah-container')}>
                <PageHeader title={title} className={cx('title')} />
                <OperationBar {...operationBarProps} />
                <Spin spinning={loading} size="large">
                    <Table {...tableProps} />
                </Spin>
            </div>
        </Spin>
    );
};

export default NoahList;
