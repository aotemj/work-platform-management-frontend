// 执行脚本相关 fields
import {InputNumber, Radio, Select, Input, Switch, Tooltip} from '@osui/ui';
import * as yup from 'yup';
import React from 'react';

import ScriptContent from './ScriptContent';
import cx from './index.less';
import {RUNNING_ENVIRONMENT, SCRIPTS_ORIGIN, TRANSMISSION_MODE} from '../constants';
import FileSource from '../FileSource';
import TargetServer from './TargetServer';
import {ReactComponent as IconRemark} from '../../../../statics/icons/remark.svg';

const {TextArea} = Input;

export const getScriptExecuteFields = ({
    isScriptExecute,
    setFormikValues,
    formikValues,
    typeSelectProps,
    handleChangeTargetServer,
    editing,
    visible,
}) => {
    const scriptExecuteFields = {
        runningEnvironment: {
            name: 'runningEnvironment',
            label: '运行环境',
            required: true,
            hide: !isScriptExecute,
            children: ({field, form: {values}}) => (
                <Radio.Group
                    {...field}
                    options={Object.values(RUNNING_ENVIRONMENT)}
                    onChange={e => {
                        setFormikValues({
                            ...values,
                            runningEnvironment: e.target.value,
                        });
                    }}
                    optionType="button"
                />
            ),
            validate: null,
        },
        scriptOrigin: {
            name: 'scriptOrigin',
            label: '脚本来源',
            required: true,
            hide: !isScriptExecute,
            children: ({field, form: {values}}) => (
                <Radio.Group
                    {...field}
                    options={Object.values(SCRIPTS_ORIGIN)}
                    onChange={e => {
                        setFormikValues({
                            ...values,
                            scriptOrigin: e.target.value,
                        });
                    }}
                    optionType="button"
                />
            ),
            validate: null,
        },
        // 选择脚本
        chooseScript: {
            name: 'chooseScript',
            label: '选择脚本',
            // 脚本来源 为 "脚本引入" 时 显示
            hide: !isScriptExecute || formikValues.scriptOrigin === SCRIPTS_ORIGIN.MANUAL_INPUT.value,
            required: true,
            children: ({filed}) => (<Select {...typeSelectProps} {...filed} />),
            validate: yup
                .string()
                .ensure()
                .required('请选择脚本'),
        },
        scriptContents: {
            name: 'scriptContents',
            label: '脚本内容',
            required: true,
            hide: !isScriptExecute,
            children: ({field, form: {values}}) => (
                <ScriptContent
                    field={field}
                    scriptLanguage={formikValues.scriptLanguage}
                    setFormikValues={setFormikValues}
                    values={values}
                    onChange={e => {
                        setFormikValues({
                            ...values,
                            scriptContents: e,
                        });
                    }}
                />
            ),
            validate: yup
                .string()
                .ensure()
                .required('请输入脚本内容'),
        },
        scriptParams: {
            name: 'scriptParams',
            label: '脚本参数',
            MAX_LENGTH: 500,
            // required: true,
            hide: !isScriptExecute,
            children: ({field}) => (
                <TextArea
                    {...field}
                    showCount
                    className={cx('noah-textarea')}
                    autoSize={{minRows: 5}}
                    maxLength={scriptExecuteFields.scriptParams.MAX_LENGTH}
                    placeholder="脚本执行时传入参数，同脚本在终端执行时的传参格式，例：./test.sh XXXX"
                />
            ),
            validate: null,
        },
        timeoutValue: {
            name: 'timeoutValue',
            label: '超时时长（秒）',
            hide: !isScriptExecute,
            // required: true,
            children: ({field}) => (
                <InputNumber
                    className={cx('time-out-input')}
                    {...field}
                    placeholder="请输入超时时长"
                />
            ),
            validate: null,
        },
        image: {
            name: 'image',
            label: '填写镜像',
            required: true,
            // 运行环境为 容器类型 显示
            hide: !isScriptExecute || formikValues.runningEnvironment !== RUNNING_ENVIRONMENT.CONTAINER.value,
            children: ({field}) => (
                <Select
                    className={cx('time-out-input')}
                    {...field}
                    placeholder="请填写镜像"
                />
            ),
            validate: null,
        },
        // 目标服务器
        targetResourceList: {
            name: 'targetResourceList',
            label: '目标服务器',
            required: true,
            // 运行环境为 主机运行时 显示
            hide: !isScriptExecute || formikValues.runningEnvironment !== RUNNING_ENVIRONMENT.AGENT.value,
            children: ({field, form: {values}}) => (
                <TargetServer
                    field={field}
                    handleChange={(agents, agentMap) =>
                        handleChangeTargetServer({agents, values, agentMap, editing})}
                    visible={visible}
                />
            ),
            validate: yup
                .array()
                .ensure()
                .min(1, '请选择目标服务器'),
        },
    };
    return scriptExecuteFields;
};

const TransmissionModeTitle = () => {
    const List = () => (
        <div>
            <p>传输至linux服务器需以/开头的绝对路径，如：/data/xx</p>
            <p>传输至Windows服务器需包含盘符开头，如：D:\tmp\</p>
        </div>
    );
    return (
        <div>
            <Tooltip title={<List />}>传输模式 <IconRemark /></Tooltip>
        </div>
    );
};

export const getFileDistribution = ({
    isFileDistribution,
    setFormikValues,
    formikValues,
    handleChangeTargetServer,
    editing,
    visible,
    userInputError,
    setUserInputError,
}) => {

    const fileDistributionFields = {
        timeoutValue: {
            name: 'timeoutValue',
            label: '超时时长(秒)',
            hide: !isFileDistribution,
            children: ({field}) => (
                <InputNumber
                    className={cx('time-out-input')}
                    {...field}
                    placeholder="请输入超时时长"
                />
            ),
            validate: null,
        },
        uploadLimit: {
            name: 'uploadLimit',
            label: '启用上传限速',
            hide: !isFileDistribution,
            children: ({field, form: {values}}) => {
                const {uploadLimitDisabled} = formikValues;
                return (
                    <div className={cx('upload-limit-container')}>
                        <Switch
                            className={cx('time-out-switch')}
                            checked={!uploadLimitDisabled}
                            onChange={e => {
                                setFormikValues({
                                    ...values,
                                    uploadLimitDisabled: !uploadLimitDisabled,
                                });
                            }}
                        />
                        { !uploadLimitDisabled && (
                            <InputNumber
                                className={cx('time-out-input')}
                                {...field}
                                addonAfter={'MB/s'}
                            />
                        )}
                    </div>
                );
            },
            validate: null,
        },
        downloadLimit: {
            name: 'downloadLimit',
            label: '启用下载限速',
            hide: !isFileDistribution,
            children: ({field, form: {values}}) => {
                const {downloadLimitDisabled} = formikValues;
                return (
                    <div className={cx('upload-limit-container')}>
                        <Switch
                            className={cx('time-out-switch')}
                            checked={!downloadLimitDisabled}
                            onChange={e => {
                                setFormikValues({
                                    ...values,
                                    downloadLimitDisabled: !downloadLimitDisabled,
                                });
                            }}
                        />
                        { !downloadLimitDisabled && (
                            <InputNumber
                                className={cx('time-out-input')}
                                {...field}
                                addonAfter={'MB/s'}
                            />
                        )}
                    </div>
                );
            },
            validate: null,
        },
        fileSource: {
            name: 'fileSource',
            hide: !isFileDistribution,
            collapseProps: {
                title: '文件来源',
                autoOpen: true,
                formFields: [
                    {
                        name: 'storageFileList',
                        label: '源文件',
                        required: true,
                        hide: !isFileDistribution,
                        children: ({field, form: {values}}) => {
                            return (
                                <FileSource
                                    field={field}
                                    values={values}
                                    setFormikValues={setFormikValues}
                                    storageFileList={formikValues.storageFileList}
                                    changeCallback={storageFileList => {
                                        setFormikValues({
                                            ...values,
                                            storageFileList,
                                        });
                                    }}
                                    userInputError={userInputError}
                                    setUserInputError={setUserInputError}
                                />
                            );
                        },
                        validate: yup.array().min(1, '请选择文件来源').of(yup.object({
                            sourcePath: yup.string().ensure().required('请输入文件路径并选择相关服务器'),
                            sourceResourceName: yup.string().ensure().required('请输入文件路径并选择相关服务器'),
                        })),
                    },
                ],
            },
        },
        transportTarget: {
            name: 'transportTarget',
            hide: !isFileDistribution,
            collapseProps: {
                title: '传输目标',
                autoOpen: true,
                formFields: [
                    {
                        name: 'targetPath',
                        label: '目标路径',
                        required: true,
                        hide: !isFileDistribution,
                        children: ({field}) => {
                            return (
                                <Input {...field} placeholder={'请填写分发路径'} />

                            );
                        },
                        validate: yup.string().ensure().required('请填写分发路径'),
                    },
                    // 传输模式
                    {
                        name: 'transmissionMode',
                        label: <TransmissionModeTitle />,
                        hide: !isFileDistribution,
                        required: true,
                        children: ({field}) => {
                            return (
                                <Radio.Group {...field}>
                                    {
                                        Object.values(TRANSMISSION_MODE).map(item => {
                                            const {key} = item;
                                            // eslint-disable-next-line react/jsx-key
                                            return <Radio {...item}>{key}</Radio>;
                                        })
                                    }
                                </Radio.Group>
                            );
                        },
                        validate: null,
                    },
                    // 目标服务器
                    {
                        name: 'targetResourceList',
                        label: '目标服务器',
                        required: true,
                        // 运行环境为 主机运行时 显示
                        hide: !isFileDistribution,
                        children: ({field, form: {values}}) => (
                            <TargetServer
                                field={field}
                                handleChange={(agents, agentMap) =>
                                    handleChangeTargetServer({agents, values, agentMap, editing})}
                                visible={visible}
                            />
                        ),
                        validate: yup
                            .array()
                            .ensure()
                            .min(1, '请选择目标服务器'),
                    },
                ],
            },
        },
    };
    return fileDistributionFields;
};
