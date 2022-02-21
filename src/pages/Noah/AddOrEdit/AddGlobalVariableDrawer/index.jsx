/**
 * 添加全局变量 drawer
 */

import {Checkbox, Drawer, Input, Select, Tooltip} from '@osui/ui';
import {useCallback, useState} from 'react';

import FormikComp from '../../../../components/FormikComp';
import * as yup from 'yup';
import cx from './index.less';
import {GLOBAL_VARIABLE_TYPE} from '../constants';
import {ReactComponent as IconRemark} from '../../../../statics/icons/remark.svg';
import {omit} from 'ramda';

const {TextArea} = Input;
const {Option} = Select;

const defaultFormikValues = {
    name: '',
    code: '',
    content: '',
    grantGroups: [],
};

const AddGlobalVariableDrawer = ({onClose, visible}) => {
    const [formikValues, setFormikValues] = useState(defaultFormikValues);

    const [disabled, setDisabled] = useState(false);

    const handleSubmit = useCallback(() => {}, []);

    const handleCancel = useCallback(() => {
        // Modal.confirm()
    }, []);

    const defaultField = {
        layout: 'horizontal',
    };

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
    const formFields = {
        type: {
            // ...defaultField,
            name: 'type',
            label: <NameLabel />,
            required: true,
            MAX_LENGTH: 80,
            children: ({field}) => {
                return (
                    <Select
                        className={cx('variable-type-list-select')}
                        {...field}
                        placeholder="请选择变量类型"
                        suffix={<IconRemark />}
                    >
                        {
                            Object.values(GLOBAL_VARIABLE_TYPE).map(item => {
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
                .required('请选择变量类型'),
        },
        name: {
            // ...defaultField,
            name: 'name',
            label: '变量名称',
            MAX_LENGTH: 80,
            required: true,
            children: ({field}) => (
                <Input
                    {...field}
                    className={cx('noah-textarea')}
                    maxLength={formFields.name.MAX_LENGTH}
                    placeholder="以英文字符、下划线开头；只允许英文字符、数字、下划线、和 -"
                />
            ),
            validate: yup
                .string()
                .ensure()
                .trim()
                .test('code', '以英文字符、下划线开头；只允许英文字符、数字、下划线、和 -', value =>
                    /^[a-zA-Z_][\w-]*$/.test(value),
                )
                .required('请输入变量名称')
                .max(80, '变量名称限80个字符'),
        },
        value: {
            // ...defaultField,
            name: 'value',
            label: '值',
            MAX_LENGTH: 1000,
            required: true,
            children: ({field}) => (
                <Input
                    {...field}
                    className={cx('noah-textarea')}
                    maxLength={formFields.name.MAX_LENGTH}
                    placeholder="请输入变量值"
                />
            ),
            validate: yup
                .string()
                .ensure()
                .trim()
                .test('code', '以英文字符、下划线开头；只允许英文字符、数字、下划线、和 -', value =>
                    /^[a-zA-Z_][\w-]*$/.test(value),
                )
                .required('请输入变量名称'),
        },
        description: {
            name: 'description',
            label: '变量描述',
            MAX_LENGTH: 500,
            children: ({field}) => (
                <TextArea
                    {...field}
                    showCount
                    className={cx('noah-textarea')}
                    autoSize={{minRows: 5}}
                    maxLength={formFields.description.MAX_LENGTH}
                    placeholder="请输入变量描述"
                />
            ),
        },
        // 赋值可变
        allowChanged: {
            // ...defaultField,
            name: 'allowChanged',
            label: null,
            hideLabel: true,
            children: ({field}) => (
                <Checkbox
                    {...(omit('value', field))}
                    checked={field.value}
                    className={cx('noah-textarea')}
                >赋值可变
                </Checkbox>
            ),
        },
        // 执行时必填
        executeRequired: {
            name: 'executeRequired',
            hideLabel: true,
            label: null,
            children: ({field}) => (
                <Checkbox
                    {...(omit('value', field))}
                    checked={field.value}
                    className={cx('noah-textarea')}
                >执行时必填
                </Checkbox>
            ),
        },
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
            title="新建全局变量"
            width={550}
            placement="right"
            onClose={onClose}
            visible={visible}
        >
            <FormikComp {...formikProps} />
        </Drawer>
    );
};
export default AddGlobalVariableDrawer;