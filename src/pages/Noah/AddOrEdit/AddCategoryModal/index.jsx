/**
 * 新增分类 modal
 */

import {Input, Modal} from '@osui/ui';
import React, {useCallback, useState} from 'react';
import * as yup from 'yup';
import FormikComp from '../../../../components/FormikComp';

const AddCategoryModal = ({visible, setVisible, submitCallback = () => {}}) => {
    const [initialValues, setInitialValues] = useState({name: ''});
    const [disabled, setDisabled] = useState(false);
    const formFields = {
        name: {
            label: '分类名称',
            name: 'name',
            required: true,
            MAX_LENGTH: 20,
            children: ({field}) => {
                const maxLength = formFields.name.MAX_LENGTH;
                return (
                    <Input
                        maxLength={maxLength}
                        placeholder="标签名支持：汉字 A-Z a-z 0-9 _ - ! # @ $ & % ^ ~ = + ."
                        suffix={<span>{field.value.length}/{maxLength}</span>}
                        {...field}
                    />
                );
            },
            validate: yup
                .string()
                .ensure()
                .trim()
                .test('code', '分类名称支持：汉字 A-Z a-z 0-9 _ - ! # @ $ & % ^ ~ = + .', value =>
                    /^[\w-_\u4e00-\u9fa5!#@$&%^~=+\.]*$/.test(value),
                )
                .required('请输入分类名称')
                .max(20, '分类名称限20个字符'),
        },
    };

    const handleSubmit = useCallback(() => {
        //    TODO 新增分类接口调用
    }, []);

    const modalProps = {
        title: '新增分类',
        visible,
        maskClosable: false,
        onCancel: () => {
            setVisible(false);
        },
        okButtonProps: {
            disabled,
        },
        onOk: () => {
            handleSubmit();
            submitCallback();
            console.log('ok');
        },
    };
    const formikProps = {
        handleSubmit,
        initialValues,
        formFields,
        needFooter: false,
        disabled,
        setDisabled,
    };
    return (
        <Modal {...modalProps}>
            <FormikComp {...formikProps} />
        </Modal>
    );
};

export default AddCategoryModal;
