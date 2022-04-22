/**
 * 添加全局变量 drawer
 */

import {omit} from 'ramda';
import {Button, Checkbox, Drawer, Input, Select, Tooltip} from '@osui/ui';
import * as yup from 'yup';
import {EyeInvisibleOutlined, EyeOutlined} from '@ant-design/icons';
import {useMemo} from 'react';

import FormikComp from '../../../../components/FormikComp';
import cx from './index.less';
import {GLOBAL_VARIABLE_TYPES} from '../constants';
import {ReactComponent as IconRemark} from '../../../../statics/icons/remark.svg';
import useGlobalVariable from '../hooks/globalVariable';

const {TextArea} = Input;
const {Option} = Select;

const AddGlobalVariableDrawer = ({
    onClose,
    visible,
    globalVariableEditingValue,
    handleChangeGlobalVariable,
    setVisible,
    globalVariablesFromServer,
}) => {
    const {
        formikValues,
        handleCancel,
        disabled,
        setDisabled,
        showCrypto,
        setShowCrypto,
        setFormikValues,
    } = useGlobalVariable({
        handleChangeGlobalVariable,
        setVisible,
        onClose,
        globalVariablesFromServer,
        visible,
    });
    const editing = useMemo(() => {
        return Boolean(globalVariableEditingValue);
    }, [globalVariableEditingValue]);

    const title = useMemo(() => {
        return editing ? '编辑全局变量' : '新建全局变量';
    }, [editing]);

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
            children: ({field, form: {values}}) => {
                return (
                    <Select
                        className={cx('variable-type-list-select')}
                        {...field}
                        placeholder="请选择变量类型"
                        onChange={type => {

                            setShowCrypto(type === GLOBAL_VARIABLE_TYPES.STRING.value);

                            setFormikValues({
                                ...values,
                                type,
                            });
                        }}
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
                .number()
                .required('请选择变量类型'),
        },
        name: {
            // ...defaultField,
            name: 'name',
            label: '变量名称',
            MAX_LENGTH: 80,
            required: true,
            children: ({field}) => {
                const maxLength = formFields.name.MAX_LENGTH;

                return (
                    <Input
                        {...field}
                        className={cx('noah-textarea')}
                        maxLength={maxLength}
                        placeholder="以英文字符、下划线开头；只允许英文字符、数字、下划线、和 -"
                        suffix={<span>{field.value.length}/{maxLength}</span>}
                    />
                );
            },
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
            required: formikValues.exeRequired,
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
            validate: formikValues.exeRequired ? yup
                .string()
                .ensure()
                .trim()
                .required('请输入变量值') : null,
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
        // 必填 当当前选项值为 true 时， 当前表单的 `value` 开启必填校验
        exeRequired: {
            name: 'exeRequired',
            hideLabel: true,
            label: 'exeRequired',
            children: ({field, form: {values}}) => (
                <Checkbox
                    {...(omit('value', field))}
                    checked={formikValues.exeRequired}
                    onChange={e => {
                        setFormikValues({
                            ...formikValues,
                            ...values,
                            exeRequired: e.target.checked,
                        });
                    }}
                    className={cx('noah-textarea')}
                >必填
                </Checkbox>
            ),
        },
    };

    const formikProps = {
        handleSubmit: e => handleChangeGlobalVariable(e, editing, globalVariableEditingValue, formikValues),
        initialValues: globalVariableEditingValue || formikValues,
        disabled,
        setDisabled,
        formFields,
        handleCancel,
        okText: '保存',
    };


    return (
        <Drawer
            title={title}
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
