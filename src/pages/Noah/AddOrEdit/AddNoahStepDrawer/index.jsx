/**
 * 新增作业步骤 Drawer
 */

import React, {useMemo} from 'react';
import {Drawer, Input, Select, Tooltip} from '@osui/ui';
import * as yup from 'yup';

import cx from './index.less';
import {STEP_TYPES} from '../constants';
import {ReactComponent as IconRemark} from '../../../../statics/icons/remark.svg';
import useAddNoahStep from './hook';
import FormikComp from '../../../../components/FormikComp';
import {getFileDistribution, getScriptExecuteFields} from './util';

const {Option} = Select;

const AddNoahStepDrawer = ({onClose, visible, handleChangeStep, stepEditingValue}) => {
    const {
        formikValues,
        setFormikValues,
        handleSubmit,
        disabled,
        setDisabled,
        handleCancel,
        handleChangeTargetServer,
        isScriptExecute,
        isFileDistribution,
        userInputError,
        setUserInputError,
    } = useAddNoahStep({
        onClose,
        handleChangeStep,
    });

    const editing = useMemo(() => {
        return Boolean(stepEditingValue);
    }, [stepEditingValue]);

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
    const scriptExecuteFields = getScriptExecuteFields({
        isScriptExecute,
        isFileDistribution,
        setFormikValues,
        formikValues,
        handleChangeTargetServer,
        visible,
        typeSelectProps,
        editing,
    });

    const fileDistributionFields =  getFileDistribution({
        isFileDistribution,
        isScriptExecute,
        setFormikValues,
        formikValues,
        handleChangeTargetServer,
        visible,
        editing,
        userInputError,
        setUserInputError,
    });

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
        ...fileDistributionFields,
    };

    const formikProps = {
        handleSubmit: e => handleSubmit(e, stepEditingValue),
        initialValues: stepEditingValue || formikValues,
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
            {visible && <FormikComp {...formikProps} />}
        </Drawer>
    );
};
export default AddNoahStepDrawer;
