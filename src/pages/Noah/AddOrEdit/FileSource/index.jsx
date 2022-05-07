// 文件分发/文件来源/源文件
import React, {useCallback, useMemo, useRef} from 'react';
import {Button, Input, Table, Progress, Space} from '@osui/ui';
import {IconPlusOutlined} from '@osui/icons';
import {omit, propOr} from 'ramda';

import TargetServer from '../AddNoahStepDrawer/TargetServer';
import EllipsisContainer from '../../../../components/EllipsisContainer';
import LoadingButton from './LoadingButton';

import cx from './index.less';
import useFileSource from './hook';
import {convertFileSize, useSelectState} from '../../../../utils';
import {ERROR, LOADING, SUCCESS} from '../constants';
import {pick} from 'lodash/fp';
import Layout from '../../../../components/FormField/Layout';
import RetryButton from './RetryButton';

const FileSource = ({
    field,
    changeCallback,
    storageFileList,
    values,
    setFormValues,
    userInputError,
    setUserInputError,
    disabled,
    form,
}) => {
    const uploadRef = useRef();
    const localFilesMap = useSelectState(['uploadDetail', 'localFilesMap']);
    const serverFilesMap = useSelectState(['uploadDetail', 'serverFilesMap']);
    const uploadingMap = useSelectState(['uploadDetail', 'uploadingMap']);

    const {
        // about server file
        handleChangeSourcePath,
        handleAddServerFile,
        handleChangeServerFileSourceResource,
        handleRemoveServerFile,

        // about local file
        handleAddLocalFile,
        handleRemoveLocalFile,

        needUpdateFileMap,

        handleReUploadLocalFile,
    } = useFileSource({changeCallback, storageFileList, values, setFormValues});

    const resetUserInputError = useCallback(() => {
        if (userInputError) {
            setUserInputError(false);
        }
    }, [setUserInputError, userInputError]);

    const RemoveButton = ({record}) => {
        return (
            <span
                className={cx('delete-button', disabled ? 'disabled' : '')}
                onClick={() => (disabled ? null : handleRemoveLocalFile(record))}
            >移除
            </span>
        );
    };

    const serverFiles = Object.values(serverFilesMap);

    const chooseServerTips = useMemo(() => {
        const length = serverFiles.length;
        return length ? `已选择 ${length} 个服务器文件` : '暂未选择文件';
    }, [serverFiles.length]);

    const serverFileTableProps = {
        dataSource: serverFiles,
        columns: [
            {
                title: '文件路径',
                dataIndex: 'sourcePath',
                width: '30%',
                render: (val, record) => {
                    const errors = form.errors?.storageFileList?.map(item => {
                        return pick('sourcePath', item);
                    });
                    return (
                        <Layout id={'sourcePath'} errors={!val && errors} className={cx('layout-item')}>
                            <Input
                                name={'sourcePath'}
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
                        </Layout>
                    );
                },
            },
            {
                title: '服务器',
                dataIndex: 'sourceUuid',
                render: (val, record) => {
                    const errors = form.errors?.storageFileList?.map(item => {
                        return pick('sourceUuid', item);
                    });
                    return (
                        <Layout id={'sourceUuid'} errors={!val && errors} className={cx('layout-item')}>
                            <TargetServer
                                name={'sourceUuid'}
                                multiple={false}
                                allowClear={false}
                                disabled={disabled}
                                field={{...omit(['onChange'], field), value: val}}
                                resetUserInputError={resetUserInputError}
                                handleChange={(agents, agentMapByUuid) =>
                                    handleChangeServerFileSourceResource(agents, agentMapByUuid, record.key)}
                            />
                        </Layout>
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
                            className={cx('delete-button', disabled ? 'disabled' : '', 'server-button')}
                            onClick={() => (disabled ? null : handleRemoveServerFile(record))}
                        >移除
                        </span>
                    );
                },
            },
        ],
        pagination: false,
    };

    const localFiles = useMemo(() => {
        return Object.values(localFilesMap);
    }, [localFilesMap]);

    const chooseLocalTips = useMemo(() => {
        const length = localFiles.length;
        return length ? `已选择 ${length} 个本地文件` : '暂未选择文件';
    }, [localFiles.length]);

    const localFileTableProps = {
        dataSource: localFiles,
        // 后期如果服务端分片大小小于 100M/每片，前端显示可以不正常，需要添加横向滚动
        // scroll: {x: 750},
        columns: [
            {
                title: '文件名',
                dataIndex: 'fileName',
                render: val => <EllipsisContainer val={val} />,
            },
            {
                title: '文件大小',
                dataIndex: 'fileSize',
                // 单位 byte
                render: val => <EllipsisContainer val={convertFileSize(val)} />,
            },
            {
                title: '操作',
                align: 'center',
                render: (_, record) => {
                    const {status, fileName, uploadStatusByFrontEnd, key} = record;
                    // 上传进度
                    const process = propOr(0, 'process', uploadingMap?.[fileName]);
                    const total = propOr(1, 'total', uploadingMap?.[fileName]);
                    const loadingProps = {
                        process,
                        total,
                        uploadStatusByFrontEnd,
                    };
                    switch (status) {
                        case SUCCESS.value:
                            return (<RemoveButton record={record} />);
                        case ERROR.value:
                            return (
                                <Space>
                                    <RetryButton fileKey={key} handleReUploadLocalFile={handleReUploadLocalFile} />
                                    <RemoveButton record={record} />
                                </Space>
                            );
                        case LOADING.value:
                            return (
                                <>
                                    <LoadingButton {...loadingProps} />
                                    <Progress
                                        percent={process}
                                        steps={total}
                                        size="small"
                                        strokeColor="#52c41a"
                                    />
                                </>
                            );
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
                    {
                        !needUpdateFileMap && (
                            <input
                                type="file"
                                className={cx('upload-button')}
                                ref={uploadRef}
                                onInput={e => handleAddLocalFile(e, uploadRef)}
                            />
                        )
                    }
                </Button>
            </div>
        </div>
    );
};

export default FileSource;
