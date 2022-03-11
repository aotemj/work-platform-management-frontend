/**
 * formik 表单与 antd 的二次封装
 */

import {Formik} from 'formik';
import React, {createRef} from 'react';
import {debounce, isEqual, set} from 'lodash/fp';
import * as yup from 'yup';
import {omit} from 'ramda';
import {Button, Collapse} from '@osui/ui';


import FormField from '../FormField';
import cx from './index.less';

const {Panel} = Collapse;
/**
 *
 * @param initialValues
 * @param handleOk
 * @param formFields
 * @returns {JSX.Element}
 * @constructor
 */
const FormikComp = ({
    initialValues,
    handleSubmit,
    formFields,
    Footer,
    disabled,
    setDisabled,
    needFooter = true,
    handleCancel,
    okText = '确定',
}) => {
    const validateObj = Object.values(formFields).reduce((prev, curr) => {
        if (!curr.hide) {
            prev[curr.name] = curr.validate;
            if (curr.collapseProps) {
                curr.collapseProps.formFields.reduce((innerPrev, innerCurr) => {
                    if (!innerCurr.hide) {
                        innerPrev[innerCurr.name] = innerCurr.validate;
                    }
                    return innerPrev;
                }, prev);
            }
        }
        return prev;
    }, {});
    const refOfValues = createRef();

    validateObj.grantGroups = yup.array();
    const validateSchema = yup.object().shape(validateObj);
    const handleFinalChange = debounce(250)((values, valid) => {
        setDisabled(!valid);
    });
    const validate = values => {
        try {
            validateSchema.validateSync(values, {abortEarly: false});
            return {};
        } catch (e) {
            return e.inner.reduce((acc, cur) => set(
                cur.path,
                // 如果希望某些特定的条件下level不是error，而是warning，
                // 请修改下面的逻辑，根据yup的返回结果进行适配
                cur.errors.map(v => ({level: 'error', text: v})),
                acc,
            ), {});
        }
    };

    const DefaultFooter = ({values}) => {
        return (
            <>
                <Button
                    type={'primary'}
                    disabled={disabled}
                    onClick={() => handleSubmit(values)}
                    className={cx('submit-button', 'button')}
                >{okText}
                </Button>
                <Button
                    className={cx('button')}
                    onClick={handleCancel}
                >取消
                </Button>
            </>
        );
    };

    const FinalFooter = props => {
        return Footer ? <Footer {...props} /> : <DefaultFooter {...props} />;
    };

    return (
        <Formik
            onSubmit={handleSubmit}
            enableReinitialize
            validate={validate}
            initialValues={initialValues}
        >
            {({values}) => {
                const valid = validateSchema.isValidSync(values);
                if (!refOfValues.current || (refOfValues.current && !isEqual(refOfValues.current, values))) {
                    handleFinalChange(values, valid);
                }
                refOfValues.current = values;
                return (
                    <>
                        {
                            Object.values(formFields).filter(item => !item.hide).map(({
                                name,
                                label,
                                children,
                                hide,
                                collapseProps,
                                ...rest
                            }) => {
                                if (collapseProps) {
                                    const {formFields, title, autoOpen} = collapseProps;
                                    return (
                                        <Collapse key={title} defaultActiveKey={autoOpen ? title : ''}>
                                            <Panel header={title} key={title}>
                                                {
                                                    formFields.filter(item => !item.hide).map(item => {
                                                        const {name, label, children, ...rest}  = item;
                                                        return (
                                                            <FormField
                                                                name={name}
                                                                label={label}
                                                                key={label}
                                                                {...omit('validate', rest)}
                                                            >
                                                                {
                                                                    children
                                                                }
                                                            </FormField>
                                                        );
                                                    })
                                                }

                                            </Panel>
                                        </Collapse>
                                    );
                                }
                                return (
                                    <FormField
                                        name={name}
                                        label={label}
                                        key={label}
                                        {...omit('validate', rest)}
                                    >
                                        {
                                            children
                                        }
                                    </FormField>
                                );


                            })
                        }
                        {needFooter && <FinalFooter values={values} />}

                    </>
                );
            }}
        </Formik>
    );
};

export default FormikComp;
