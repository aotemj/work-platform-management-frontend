// 文件分发/文件来源/源文件
import React, {useCallback, useRef} from 'react';
import {Button, Input, Table} from '@osui/ui';

import cx from './index.less';
import useFileSource from './hook';
import {IconPlusOutlined} from '@osui/icons';
import TargetServer from '../AddNoahStepDrawer/TargetServer';
import {omit} from 'ramda';
import {convertFileSize} from '../../../../utils';
import {ERROR, LOADING, SUCCESS} from '../constants';

const FileSource = ({
    field,
    changeCallback,
    storageFileList,
    values,
    setFormValues,
    userInputError,
    setUserInputError,
    disabled,
}) => {
    const uploadRef = useRef();
    const {
        // about server file
        handleChangeSourcePath,
        handleAddServerFile,
        handleChangeServerFileSourceResource,
        handleRemoveServerFile,
        chooseServerTips,
        serverFiles,

        // about local file
        handleAddLocalFile,
        localFiles,
        handleRemoveLocalFile,
        chooseLocalTips,
    } = useFileSource({changeCallback, storageFileList, values, setFormValues});

    const resetUserInputError = useCallback(() => {
        if (userInputError) {
            setUserInputError(false);
        }
    }, [setUserInputError, userInputError]);

    const RetryButton = () => {
        return <span>重试</span>;
    };

    const RemoveButton = ({record}) => {
        return (
            <span
                className={cx('delete-button', disabled ? 'disabled' : '')}
                onClick={() => (disabled ? null : handleRemoveLocalFile(record))}
            >移除
            </span>
        );
    };

    const LoadingButton = () => {
        return <span>正在上传</span>;
    };

    const serverFileTableProps = {
        dataSource: serverFiles,
        columns: [
            {
                title: '文件路径',
                dataIndex: 'sourcePath',
                width: '30%',
                render: (val, record) => {
                    return (
                        <>
                            <Input
                                value={val}
                                {...omit(['value'], field)}
                                disabled={disabled}
                                onChange={e => {
                                    handleChangeSourcePath({
                                        value: e.target.value,
                                        key: record.key,
                                    });
                                }}
                                onFocus={resetUserInputError}
                                placeholder={'请输入路径'}
                            />
                        </>
                    );
                },
            },
            {
                title: '服务器',
                dataIndex: 'sourceResourceName',
                render: (val, record) => {
                    return (
                        <TargetServer
                            multiple={false}
                            allowClear={false}
                            disabled={disabled}
                            field={{...omit(['onChange'], field), value: val}}
                            resetUserInputError={resetUserInputError}
                            handleChange={(agents, agentMapByUuid) =>
                                handleChangeServerFileSourceResource(agents, agentMapByUuid, record.key)}
                        />
                    );
                },
            },
            {
                title: '操作',
                align: 'center',
                width: '10%',
                render: (_, record) => {
                    return (
                        <span
                            className={cx('delete-button', disabled ? 'disabled' : '')}
                            onClick={() => (disabled ? null : handleRemoveServerFile(record))}
                        >移除
                        </span>
                    );
                },
            },
        ],
        pagination: false,
    };

    const localFileTableProps = {
        dataSource: localFiles,
        columns: [
            {
                title: '文件名',
                dataIndex: 'fileName',
                // width: '30%',
            },
            {
                title: '文件大小',
                dataIndex: 'fileSize',
                // width: '20%',
                // 单位 byte
                render: val => convertFileSize(val),
            },
            {
                title: '操作',
                align: 'center',
                // width: '10%',
                render: (_, record) => {
                    const {status} = record;
                    switch (status) {
                        case SUCCESS.value:
                            return (
                                <RemoveButton />
                            );
                        case ERROR.value:
                            return (
                                <>
                                    <RetryButton />
                                    <RemoveButton />
                                </>
                            );
                        case LOADING.value:
                            return <LoadingButton />;
                    }

                },
            },
        ],
        pagination: false,
    };

    return (
        <div className={cx('file-source-container', userInputError ? 'has-error' : '')}>
            <div className={cx('file-from-server')}>
                <p className={cx('file-choose-tips')}>{chooseServerTips}</p>
                <div className={cx('inner')}>
                    <Table {...serverFileTableProps} />
                    <Button
                        size={'small'}
                        icon={<IconPlusOutlined />}
                        className={cx('add-button')}
                        onClick={handleAddServerFile}
                        disabled={disabled}
                    >添加服务器文件
                    </Button>
                </div>
            </div>
            <div className={cx('file-from-local')}>
                <p className={cx('file-choose-tips')}>{chooseLocalTips}</p>
                <Table {...localFileTableProps} />
                <Button
                    disabled={disabled}
                    size={'small'}
                    icon={<IconPlusOutlined />}
                    className={cx('add-button')}
                    onClick={() => {
                        uploadRef.current.click();
                    }}
                >添加本地文件
                    <input type="file" className={cx('upload-button')} ref={uploadRef} onChange={handleAddLocalFile} />
                </Button>
            </div>
        </div>
    );
};

export default FileSource;
