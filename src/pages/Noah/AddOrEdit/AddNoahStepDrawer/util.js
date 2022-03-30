// 执行脚本相关 fields
import {InputNumber, Radio, Select, Input, Switch, Tooltip, Checkbox} from '@osui/ui';
import * as yup from 'yup';
import React from 'react';

import ScriptContent from './ScriptContent';
import cx from './index.less';
import {NOTICE_APPROACHES, RUNNING_ENVIRONMENT, SCRIPTS_ORIGIN, TRANSMISSION_MODE} from '../constants';
import FileSource from '../FileSource';
import TargetServer from './TargetServer';
import {ReactComponent as IconRemark} from '../../../../statics/icons/remark.svg';
import SelectAll from '../../../../components/SelectAll';

const {Option} = Select;
const {TextArea} = Input;

export const getScriptExecuteFields = ({
    isScriptExecute,
    isFileDistribution,
    setFormValues,
    formikValues,
    typeSelectProps,
    handleChangeTargetServer,
    editing,
    visible,
    isViewing,
}) => {
    const isManualConfirm = !isFileDistribution && !isScriptExecute;

    const isHideChooseScript = !isScriptExecute || formikValues.scriptOrigin === SCRIPTS_ORIGIN.MANUAL_INPUT.value;

    const scriptExecuteFields = {
        runningEnvironment: {
            name: 'runningEnvironment',
            label: '运行环境',
            required: true,
            hide: !isScriptExecute,
            children: ({field, form: {values}}) => (
                <Radio.Group
                    {...field}
                    disabled={isViewing}
                    options={Object.values(RUNNING_ENVIRONMENT).filter(item => !item.disabled)}
                    onChange={e => {
                        setFormValues({
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
                    disabled={isViewing}
                    options={Object.values(SCRIPTS_ORIGIN)}
                    onChange={e => {
                        setFormValues({
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
            hide: isHideChooseScript,
            required: !isHideChooseScript,
            children: ({filed}) => (<Select {...typeSelectProps} {...filed} />),
            validate: isHideChooseScript ? null : yup
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
                    disabled={isViewing}
                    scriptLanguage={formikValues.scriptLanguage}
                    setFormValues={setFormValues}
                    values={values}
                    onChange={e => {
                        setFormValues({
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
        // TODO 暂时隐藏, 需求来自 张超[backend]
        // scriptParams: {
        //     name: 'scriptParams',
        //     label: '脚本参数',
        //     MAX_LENGTH: 500,
        //     // required: true,
        //     hide: !isScriptExecute,
        //     children: ({field}) => (
        //         <TextArea
        //             {...field}
        //             showCount
        //             disabled={isViewing}
        //             className={cx('noah-textarea')}
        //             autoSize={{minRows: 5}}
        //             maxLength={scriptExecuteFields.scriptParams.MAX_LENGTH}
        //             placeholder="脚本执行时传入参数，同脚本在终端执行时的传参格式，例：./test.sh XXXX"
        //         />
        //     ),
        //     validate: null,
        // },
        timeoutValue: {
            name: 'timeoutValue',
            label: '超时时长（秒）',
            hide: !isScriptExecute || isManualConfirm,
            // required: true,
            children: ({field}) => (
                <InputNumber
                    className={cx('time-out-input')}
                    {...field}
                    disabled={isViewing}
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
                    disabled={isViewing}
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
                    disabled={isViewing}
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
    isScriptExecute,
    setFormValues,
    formikValues,
    handleChangeTargetServer,
    editing,
    visible,
    userInputError,
    setUserInputError,
    isViewing,
}) => {
    const isManualConfirm = !isFileDistribution && !isScriptExecute;

    return {
        timeoutValue: {
            name: 'timeoutValue',
            label: '超时时长(秒)',
            hide: !isFileDistribution || isManualConfirm,
            children: ({field}) => (
                <InputNumber
                    className={cx('time-out-input')}
                    {...field}
                    disabled={isViewing}
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
                                setFormValues({
                                    ...values,
                                    uploadLimitDisabled: !e,
                                });
                            }}
                            disabled={isViewing}
                        />
                        { !uploadLimitDisabled && (
                            <InputNumber
                                className={cx('time-out-input')}
                                {...field}
                                disabled={isViewing}
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
                            disabled={isViewing}
                            onChange={e => {
                                setFormValues({
                                    ...values,
                                    downloadLimitDisabled: !downloadLimitDisabled,
                                });
                            }}
                        />
                        { !downloadLimitDisabled && (
                            <InputNumber
                                className={cx('time-out-input')}
                                {...field}
                                disabled={isViewing}
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
                                    setFormValues={setFormValues}
                                    disabled={isViewing}
                                    storageFileList={formikValues.storageFileList}
                                    changeCallback={storageFileList => {
                                        setFormValues({
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
                                <Input {...field} placeholder={'请填写分发路径'} disabled={isViewing} />
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
                                <Radio.Group
                                    {...field}
                                    disabled={isViewing}
                                >
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
                                disabled={isViewing}
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
};

export const getManualConfirmFields = ({
    isFileDistribution,
    isScriptExecute,
    setFormValues,
    formikValues,
    handleChangeTargetServer,
    editing,
    visible,
    usersFromOne,
}) => {
    const isManualConfirm = !isFileDistribution && !isScriptExecute;

    const timeoutValueProps = {
        options: (new Array(24).fill(0)).map((item, index) => {
            return {label: index + 1, value: index + 1};
        }),
        getPopupContainer: triggerNode => triggerNode.parentNode,
        className: cx('noah-list-select'),
        placeholder: '请选择超时时间',
        defaultValue: 3,
        showSearch: true,
        // allowClear: true,
        optionFilterProp: 'label',
        // mode: 'multiple',
        // onChange: () => {},
        value: [],
    };

    const fields = {
        // 通知方式
        informWay: {
            name: 'informWay',
            label: '通知方式',
            required: true,
            // 运行环境为 人工确认时 显示
            hide: !isManualConfirm,
            children: ({field}) => (
                <Checkbox.Group
                    {...field}
                    options={Object.values(NOTICE_APPROACHES).filter(item => item.visible)}
                />
            ),
            validate: yup
                .array()
                .ensure()
                .min(1, '请选择通知方式'),
        },
        // 通知人员
        informUserId: {
            name: 'informUserId',
            label: '通知人员',
            required: true,
            // 运行环境为 人工确认时 显示
            hide: !isManualConfirm,
            children: ({field}) => (
                <SelectAll
                    className={cx('category-dropdown')}
                    placeholder="请选择通知人员"
                    maxTagCount={Math.min(usersFromOne?.list.length, 3)}
                    {...field}
                >
                    {
                        usersFromOne?.list.map(item => {
                            return (
                                <Option
                                    // value={Number(item.userId)}
                                    value={item.userId}
                                    key={item.enterpriseCard}
                                >{item.enterpriseCard}
                                </Option>
                            );
                        })
                    }
                </SelectAll>
            ),
            validate: yup
                .array()
                .ensure()
                .min(1, '请选择通知人员'),
        },
        describes: {
            name: 'describes',
            label: '通知描述',
            MAX_LENGTH: 60,
            hide: !isManualConfirm,
            children: ({field}) => (
                <TextArea
                    {...field}
                    showCount
                    className={cx('noah-textarea')}
                    autoSize={{minRows: 3}}
                    maxLength={fields.describes.MAX_LENGTH}
                    placeholder="请输入变量描述"
                />
            ),
        },
        timeoutValue: {
            name: 'timeoutValue',
            label: '超时时间（小时）',
            hide: !isManualConfirm,
            children: ({field}) => <Select {...timeoutValueProps} {...field} />,
        },
    };
    return fields;
};
