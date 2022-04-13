/**
 * 新增作业步骤 Drawer
 */

import React, {useCallback, useMemo} from 'react';
import {Drawer, Input, Select, Tooltip} from '@osui/ui';
import * as yup from 'yup';

import cx from './index.less';
import {ReactComponent as IconRemark} from '../../../../statics/icons/remark.svg';
import useAddNoahStep from './hook';
import FormikComp from '../../../../components/FormikComp';
import {getFileDistribution, getManualConfirmFields, getScriptExecuteFields} from './util';
import {STEP_TYPES} from '../../../../constant';

const {Option} = Select;

const AddNoahStepDrawer = ({
    onClose,
    visible,
    handleChangeStep,
    stepEditingValue,
    setStepEditingValue,
    // editing
    isViewing,
    updateUserFromOne,
    users: usersFromOne,
}) => {
    const {
        formikValues,
        setFormikValues,
        handleSubmit,
        disabled,
        setDisabled,
        handleCancel,
        handleChangeTargetServer,
        userInputError,
        setUserInputError,
        scripts,
        handleChangeImportScript,
        handleSearchInformUser,
        handleSearchScript,
    } = useAddNoahStep({
        onClose,
        handleChangeStep,
        stepEditingValue,
        setStepEditingValue,
        updateUserFromOne,
        visible,
    });

    const editing = useMemo(() => {
        return Boolean(stepEditingValue);
    }, [stepEditingValue]);

    const title = useMemo(() => {
        return isViewing ? stepEditingValue?.name : (editing ? '编辑作业步骤' : '新建作业步骤');
    }, [editing, isViewing, stepEditingValue]);

    const setFormValues = useCallback(e => {
        return editing ? setStepEditingValue(e) : setFormikValues(e);
    }, [editing, setFormikValues, setStepEditingValue]);

    const NameLabel = () => {
        return (
            <div className={cx('name-label')}>
                <span>步骤类型</span>
                <Tooltip title={'在步骤参数或脚本内使用 ${变量名} 即可获取到变量值'}>
                    <IconRemark />
                </Tooltip>
            </div>
        );
    };

    const defaultFormField = {
        type: {
            // ...defaultField,
            name: 'type',
            label: <NameLabel />,
            required: true,
            MAX_LENGTH: 80,
            children: ({field, form: {values}}) => {
                return (
                    <Select
                        disabled={isViewing}
                        className={cx('variable-type-list-select')}
                        {...field}
                        onChange={e => {
                            setFormValues({
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
                const {MAX_LENGTH} = defaultFormField.name;
                return (
                    <Input
                        {...field}
                        disabled={isViewing}
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
    };

    const updateFormFields = useCallback(() => {
        const formData = editing ? stepEditingValue : formikValues;
        const {type} = formData;
        const isScriptExecute = type === STEP_TYPES.EXECUTE_SCRIPT.value;

        const isFileDistribution = type === STEP_TYPES.FILE_DISTRIBUTION.value;

        const typeSelectProps = {
            options: scripts.map(project => {
                const {name, id, tags} = project;
                return {label: name, value: id, key: id, tags};
            }),
            getPopupContainer: triggerNode => triggerNode.parentNode,
            className: cx('noah-list-select'),
            placeholder: '请选择脚本',
            showSearch: true,
            allowClear: true,
            filterOption: false,
            onSearch: handleSearchScript,
            disabled: isViewing,
            onChange: handleChangeImportScript,
            value: formData.chooseScript,
        };

        // 执行脚本相关 fields
        const scriptExecuteFields = getScriptExecuteFields({
            isScriptExecute,
            isFileDistribution,
            setFormValues,
            formikValues: formData,
            handleChangeTargetServer,
            visible,
            typeSelectProps,
            editing,
            isViewing,
        });

        const fileDistributionFields =  getFileDistribution({
            isFileDistribution,
            isScriptExecute,
            setFormValues,
            formikValues: formData,
            handleChangeTargetServer,
            visible,
            editing,
            userInputError,
            setUserInputError,
            isViewing,
        });

        const manualConfirmFields = getManualConfirmFields({
            isFileDistribution,
            isScriptExecute,
            setFormValues,
            formikValues: formData,
            handleChangeTargetServer,
            visible,
            editing,
            usersFromOne,
            isViewing,
            updateUserFromOne,
            handleSearchInformUser,
        });
        switch (type) {
            case STEP_TYPES.EXECUTE_SCRIPT.value:
                return {
                    ...defaultFormField,
                    ...scriptExecuteFields,
                };
            case STEP_TYPES.FILE_DISTRIBUTION.value:
                return {
                    ...defaultFormField,
                    ...fileDistributionFields,
                };
            case STEP_TYPES.MANUAL_CONFIRM.value:
                return {
                    ...defaultFormField,
                    ...manualConfirmFields,
                };
        }
    }, [
        defaultFormField,
        editing,
        formikValues,
        handleChangeImportScript,
        handleChangeTargetServer,
        isViewing,
        scripts,
        setFormValues,
        setUserInputError,
        stepEditingValue,
        userInputError,
        usersFromOne,
        visible,
    ]);

    const formikProps = {
        handleSubmit: e => handleSubmit(e, stepEditingValue),
        initialValues: stepEditingValue || formikValues,
        disabled,
        setDisabled,
        formFields: updateFormFields(),
        handleCancel,
        needFooter: !isViewing,
        okText: '保存',
    };

    return (
        <Drawer
            title={title}
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
