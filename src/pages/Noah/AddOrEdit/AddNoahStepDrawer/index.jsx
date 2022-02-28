/**
 * 新增作业步骤 Drawer
 */

import {Drawer, Input, Select, Tooltip, Radio, InputNumber} from '@osui/ui';
import * as yup from 'yup';
import React from 'react';

import FormikComp from '../../../../components/FormikComp';
import cx from './index.less';
import {RUNNING_ENVIRONMENT, SCRIPTS_ORIGIN, STEP_TYPES} from '../constants';
import {ReactComponent as IconRemark} from '../../../../statics/icons/remark.svg';
import ScriptContent from './ScriptContent';
import TargetServer from './TargetServer';
import useAddNoahStep from './hook';

const {TextArea} = Input;
const {Option} = Select;


const AddNoahStepDrawer = ({onClose, visible, handleChangeStep}) => {
    const {
        formikValues,
        setFormikValues,
        handleSubmit,
        disabled,
        setDisabled,
        handleCancel,
        handleChangeTargetServer,
        isScriptExecute,
    } = useAddNoahStep({onClose, handleChangeStep});

    // const defaultField = {
    //     layout: 'horizontal',
    // };

    const NameLabel = () => {
        return (
            <div className={cx('name-label')}>
                <span>变量类型</span>
                <Tooltip title={'在步骤参数或脚本内使用 ${变量名} 即可获取到变量值'}>
                    <IconRemark />
                </Tooltip>
            </div>
        );
    };

    const typeSelectProps = {
        options: [].map(project => {
            const {name, id, tags} = project;
            return {label: name, value: id, key: id, tags};
        }),
        getPopupContainer: triggerNode => triggerNode.parentNode,
        className: cx('noah-list-select'),
        placeholder: '请选择脚本',
        showSearch: true,
        allowClear: true,
        // optionFilterProp: isFilterFromTags ? 'tags' : 'label',
        // optionFilterProp: 'label',
        // mode: 'multiple',
        onChange: () => {},
        value: '',
    };

    // 执行脚本相关 fields
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
        scriptContent: {
            name: 'scriptContent',
            label: '脚本内容',
            required: true,
            hide: !isScriptExecute,
            children: ({field, form: {values}}) => (
                <ScriptContent
                    field={field}
                    onChange={e => {
                        setFormikValues({
                            ...values,
                            scriptContent: e,
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
            required: true,
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
            validate: yup
                .string()
                .ensure()
                .required('请输入脚本内容'),
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
        targetResourceList: {
            name: 'targetResourceList',
            label: '目标服务器',
            required: true,
            // 运行环境为 主机运行时 显示
            hide: !isScriptExecute || formikValues.runningEnvironment !== RUNNING_ENVIRONMENT.AGENT.value,
            children: ({field, form: {values}}) => (
                <TargetServer field={field} handleChange={e => handleChangeTargetServer(e, values)} />
            ),
            validate: yup
                .array()
                .ensure()
                .min(1, '请选择目标服务器'),
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
    };

    const formFields = {
        type: {
            // ...defaultField,
            name: 'type',
            label: <NameLabel />,
            required: true,
            MAX_LENGTH: 80,
            children: ({field, form: {values}}) => {
                return (
                    <Select
                        className={cx('variable-type-list-select')}
                        {...field}
                        onChange={e => {
                            setFormikValues({
                                ...values,
                                type: e,
                            });
                        }}
                        placeholder="请选择步骤类型"
                        suffix={<IconRemark />}
                    >
                        {
                            Object.values(STEP_TYPES).map(item => {
                                return <Option key={item.label} value={item.value}>{item.label}</Option>;
                            })
                        }
                    </Select>
                );
            },
            validate: yup
                .string()
                .ensure()
                .trim()
                .required('请选择步骤类型'),
        },
        name: {
            // ...defaultField,
            name: 'name',
            label: '步骤名称',
            MAX_LENGTH: 60,
            required: true,
            children: ({field}) => {
                const {MAX_LENGTH} = formFields.name;
                return (
                    <Input
                        {...field}
                        className={cx('noah-textarea')}
                        maxLength={MAX_LENGTH}
                        placeholder="请输入步骤名称"
                        suffix={<span>{field.value.length}/{MAX_LENGTH}</span>}
                    />
                );
            },
            validate: yup
                .string()
                .ensure()
                .trim()
                // .test('code', '以英文字符、下划线开头；只允许英文字符、数字、下划线、和 -', value =>
                //     /^[a-zA-Z_][\w-]*$/.test(value),
                // )
                .required('请输入步骤名称')
                .max(60, '步骤名称限60个字符'),
        },
        // 执行脚本相关
        ...scriptExecuteFields,


    };

    const formikProps = {
        handleSubmit,
        initialValues: formikValues,
        disabled,
        setDisabled,
        formFields,
        handleCancel,
        okText: '保存',
    };

    return (
        <Drawer
            title="新建作业步骤"
            width={650}
            placement="right"
            onClose={onClose}
            visible={visible}
        >
            <FormikComp {...formikProps} />
        </Drawer>
    );
};
export default AddNoahStepDrawer;
