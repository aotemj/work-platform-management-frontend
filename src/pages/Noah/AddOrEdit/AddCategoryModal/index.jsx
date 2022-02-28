/**
 * 新增分类 modal
 */

import {Button, Input, Modal} from '@osui/ui';
import React, {useState} from 'react';
import * as yup from 'yup';
import FormikComp from '../../../../components/FormikComp';
import useCategory from '../hooks/category';
import cx from './index.less';

const AddCategoryModal = ({visible, setVisible}) => {
    const [initialValues] = useState({name: ''});
    const [disabled, setDisabled] = useState(false);
    const {handleSubmitAddCategory} = useCategory();
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
        // onOk: handleSubmit,
        footer: null,
    };
    const formikProps = {
        initialValues,
        formFields,
        // needFooter: false,
        Footer: ({values}) => {
            return (
                <div className={cx('footer')}>
                    <Button
                        type={'primary'}
                        disabled={disabled}
                        onClick={() => handleSubmitAddCategory(values)}
                        className={cx('submit-button')}
                    >确定
                    </Button>
                </div>
            );
        },
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
