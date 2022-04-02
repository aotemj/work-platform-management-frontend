import {Drawer, Input, Radio, DatePicker, Select, Checkbox, TimePicker} from '@osui/ui';
import * as yup from 'yup';
import moment from 'moment';
import {useRef} from 'react';

import cx from './index.less';
import FormikComp from '../../../../components/FormikComp';
import useAddOrEditCron from './hook';
import {CRON_DATE_WEEKS, STRATEGIES} from '../../constant';
import NoahDetail from './NoahDetail';

const AddOrEditCron = props => {
    const {
        visible,
        setVisible,
        onClose,
        editing,
        noahList,
        noahTotal,
        noahDetail,
        categoryMap,
        getNoahList,
        getNoahWorkPlanDetail,
        getCategoryList,
        editDetailId,
    } = props;
    const {
        disabled,
        setDisabled,
        formikValues,
        editValues,
        handleChangeNoah,
        convertedNoahDetail,
        handleChangeDatePicker,
        handleToggleCheckAll,
        selectAll,
        indeterminate,
        setFormValues,
        handleSubmit,
    } = useAddOrEditCron({
        noahList,
        noahTotal,
        noahDetail,
        editing,
        editDetailId,
        getNoahList,
        getNoahWorkPlanDetail,
        getCategoryList,
        setVisible,
        visible,
    });

    let formRef = useRef();

    const Title = () => {
        return (
            <div className={cx('cron-add-header')}>
                <div className={cx('left')}>
                    {editing ? '编辑定时任务' : '新建定时任务'}
                </div>
                {/*  暂时保留后期可能会用到 */}
                {/* <div className={cx('right')}> */}
                {/*    <Button danger>删除</Button> */}
                {/*    <Button */}
                {/*        disabled={disabled} */}
                {/*        type={'primary'} */}
                {/*        onClick={() => handleSubmit(formRef.current.values)} */}
                {/*    >保存 */}
                {/*    </Button> */}
                {/* </div> */}
            </div>
        );
    };

    const initialValues = editValues || formikValues;

    const formFields = {
        taskName: {
            label: '任务名称',
            name: 'taskName',
            required: true,
            MAX_LENGTH: 80,
            children: ({field}) => {
                const maxLength = formFields.taskName.MAX_LENGTH;
                return (
                    <Input
                        {...field}
                        maxLength={maxLength}
                        placeholder="请输入任务名称"
                        suffix={<span>{field.value.length}/{maxLength}</span>}
                    />
                );
            },
            validate: yup
                .string()
                .ensure()
                .trim()
                // .test('code', '分类名称支持：汉字 A-Z a-z 0-9 _ - ! # @ $ & % ^ ~ = + .', value =>
                //     /^[\w-_\u4e00-\u9fa5!#@$&%^~=+\.]*$/.test(value),
                // )
                .required('请输入任务名称'),
        },
        exePolicy: {
            label: '执行策略',
            name: 'exePolicy',
            required: true,
            children: ({field, form: {values}}) => {
                return (
                    <div className={cx('strategy-container')}>
                        <Radio.Group
                            {...field}
                            options={Object.values(STRATEGIES).filter(item => !item.disabled)}
                            onChange={e => {
                                setFormValues({
                                    ...values,
                                    exePolicy: e.target.value,
                                });
                            }}
                            optionType="button"
                        />
                    </div>
                );
            },
            validate: yup.string().ensure().trim().required('请选择执行时间'),
        },
        // 日期选择
        datePicker: {
            label: '日期选择',
            name: 'datePicker',
            required: true,
            children: ({field, form: {values}}) => {
                const {exePolicy} = values;
                const isLoop = exePolicy === STRATEGIES.LOOP.value;
                return isLoop ? (
                    <div className={cx('data-picker-container')}>
                        <Checkbox
                            indeterminate={indeterminate}
                            checked={selectAll}
                            {...field}
                            onChange={e => handleToggleCheckAll(e, values)}
                        >全选
                        </Checkbox>
                        <Checkbox.Group
                            options={CRON_DATE_WEEKS}
                            {...field}
                            defaultValue={[CRON_DATE_WEEKS[0].value]}
                            value={initialValues.datePicker}
                            onChange={e => handleChangeDatePicker(e, values)}
                        />
                    </div>
                ) : (
                    <DatePicker
                        defaultValue={moment()}
                        className={cx('single-picker')}
                        allowClear={false}
                        showTime
                        // onChange={() => {}}
                        onOk={e => {
                            setFormValues({
                                ...values,
                                exeCron: e.valueOf(),
                            });
                        }}
                        format={STRATEGIES.SINGLE.format}
                    />
                );
            },
            validate: yup
                .array()
                .min(1, '请至少选择选择一个日期'),
        },
        // 执行时间
        timerPicker: {
            label: '执行时间',
            name: 'timerPicker',
            required: true,
            hide: initialValues?.exePolicy === STRATEGIES.SINGLE.value,
            children: ({form: {values}}) => {
                return (
                    <TimePicker
                        allowClear={false}
                        showNow={false}
                        suffixIcon={null}
                        defaultValue={moment()}
                        format={'HH:mm'}
                        onOk={e => {
                            setFormValues({
                                ...values,
                                timerPicker: e.valueOf(),
                            });
                        }}
                    />
                );
            },
            validate: yup.string().required('请选择执行时间'),
        },
        // 作业方案
        workId: {
            label: '作业方案',
            name: 'workId',
            required: true,
            children: ({field, form: {values}}) => {
                const noahDetailProps = {
                    noahDetail: convertedNoahDetail,
                    categoryMap,
                };
                const workPlanSelectProps = {
                    options: noahList?.map(item => {
                        const {name, id} = item;
                        return {label: name, value: id, key: id};
                    }),
                    getPopupContainer: triggerNode => triggerNode.parentNode,
                    className: cx('noah-list-select'),
                    placeholder: '请选择脚本',
                    showSearch: true,
                    allowClear: true,
                    onChange: e => handleChangeNoah(e, values),
                };

                return (
                    <div className={cx('work-id-field')}>
                        <Select {...field} {...workPlanSelectProps} />
                        {/* 已选择的作业方案  */}
                        {field.value && <NoahDetail {...noahDetailProps} />}
                    </div>
                );
            },
            validate: yup.number().required().integer('请选择作业方案'),
        },
    };

    const formikProps = {
        handleSubmit: () => handleSubmit(formRef.current.values),
        initialValues,
        disabled,
        setDisabled,
        formFields,
        handleCancel: () => {},
        transformRef: form => {
            formRef.current = form;
        },
        // needFooter: false,
    };

    return (
        <Drawer
            title={<Title />}
            width={720}
            placement="right"
            onClose={onClose}
            visible={visible}
        >
            <FormikComp {...formikProps} />
        </Drawer>
    );
};
export default AddOrEditCron;
