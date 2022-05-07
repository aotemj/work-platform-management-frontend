import {Modal, Input} from '@osui/ui';
import {useRef, useState} from 'react';
import * as yup from 'yup';

import FormikComp from '../../../../../../components/FormikComp';
import cx from './index.less';
import {CONFIRM_RESULTS} from '../../../constant';
import {debounceWith250ms} from '../../../../../../utils';

const {TextArea} = Input;
const defaultData = {reason: ''};
const NoPassReasonModal = ({visible, setVisible, confirmManualResult, stageTriggerItemId}) => {
    const [disabled, setDisabled] = useState(true);
    const formRef = useRef();

    const handleSubmit = debounceWith250ms(async () => {
        const {reason} = formRef.current?.values;
        const params = {
            confirmResult: CONFIRM_RESULTS.NO_PASS,
            noPassReason: reason,
            id: stageTriggerItemId,
        };
        await confirmManualResult(params);
    });

    const modalProps = {
        visible,
        title: '不通过的原因',
        okButtonProps: {
            disabled,
        },
        onOk: handleSubmit,
        onCancel: () => {
            setVisible(false);
        },
    };

    const formFields = {
        name: {
            name: 'reason',
            label: '不通过的原因',
            required: true,
            MAX_LENGTH: 500,
            children: ({field}) => {
                const {MAX_LENGTH} = formFields.name;
                return (
                    <TextArea
                        className={cx('noah-textarea')}
                        placeholder={'请填写不通过的原因'}
                        showCount
                        maxLength={MAX_LENGTH}
                        autoSize={{minRows: 5}}
                        {...field}
                    />
                );
            },
            validate: yup
                .string()
                .ensure()
                .trim()
                .required('请填写不通过的原因')
                .max(500, '不通过的原因限500个字符'),
        },
    };
    const formikProps = {
        initialValues: defaultData,
        disabled,
        setDisabled,
        formFields,
        // handleCancel: () => setVisible(false),
        needFooter: false,
        okText: '保存',
        transformRef: form => {
            formRef.current = form;
        },
    };
    return (
        <Modal {...modalProps}>
            <FormikComp {...formikProps} />
        </Modal>
    );
};

export default NoPassReasonModal;
