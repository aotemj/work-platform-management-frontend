/**
 * 添加全局变量 drawer
 */

import {omit} from 'ramda';
import {Button, Checkbox, Drawer, Input, Select, Tooltip} from '@osui/ui';
import * as yup from 'yup';
import {EyeInvisibleOutlined, EyeOutlined} from '@ant-design/icons';

import FormikComp from '../../../../components/FormikComp';
import cx from './index.less';
import {GLOBAL_VARIABLE_TYPES} from '../constants';
import {ReactComponent as IconRemark} from '../../../../statics/icons/remark.svg';
import useGlobalVariable from '../hooks/globalVariable';
import {useMemo} from 'react';

const {TextArea} = Input;
const {Option} = Select;

const AddGlobalVariableDrawer = ({
    onClose,
    visible,
    globalVariableEditingValue,
    handleChangeGlobalVariable,
    setVisible,
}) => {
    // const defaultField = {
    //     layout: 'horizontal',
    // };
    const {
        formikValues,
        handleCancel,
        disabled,
        setDisabled,
        showCrypto,
        setShowCrypto,
    } = useGlobalVariable({
        handleChangeGlobalVariable,
        setVisible,
        onClose,
    });
    const editing = useMemo(() => {
        return Boolean(globalVariableEditingValue);
    }, [globalVariableEditingValue]);
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

    const ValueSuffix = ({setShowCrypto, showCrypto}) => {
        return (
            <Button onClick={() => setShowCrypto(!showCrypto)} type={'text'}>
                {showCrypto ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            </Button>
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
                            Object.values(GLOBAL_VARIABLE_TYPES).map(item => {
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
            // required: true,
            children: ({field, form: {values}}) => (
                <Input
                    {...field}
                    type={showCrypto ? 'text' : 'password'}
                    className={cx('noah-textarea')}
                    suffix={values.type === GLOBAL_VARIABLE_TYPES.STRING.value
                        ? null
                        : <ValueSuffix showCrypto={showCrypto} setShowCrypto={setShowCrypto} />}
                    maxLength={formFields.name.MAX_LENGTH}
                    placeholder="请输入变量值"
                />
            ),
            validate: null,
        },
        describes: {
            name: 'describes',
            label: '变量描述',
            MAX_LENGTH: 500,
            children: ({field}) => (
                <TextArea
                    {...field}
                    showCount
                    className={cx('noah-textarea')}
                    autoSize={{minRows: 5}}
                    maxLength={formFields.describes.MAX_LENGTH}
                    placeholder="请输入变量描述"
                />
            ),
        },
        // 赋值可变
        exeChange: {
            // ...defaultField,
            name: 'exeChange',
            hideLabel: true,
            label: 'exeChange',
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
        exeRequired: {
            name: 'exeRequired',
            hideLabel: true,
            label: 'exeRequired',
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
        handleSubmit: e => handleChangeGlobalVariable(e, editing, globalVariableEditingValue),
        initialValues: globalVariableEditingValue || formikValues,
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
            {
                visible && <FormikComp {...formikProps} />
            }
        </Drawer>
    );
};
export default AddGlobalVariableDrawer;
