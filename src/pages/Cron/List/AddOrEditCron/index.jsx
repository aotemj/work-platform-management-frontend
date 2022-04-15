import {Drawer, Input, Radio, DatePicker, Select, Checkbox, TimePicker} from '@osui/ui';
import * as yup from 'yup';
import moment from 'moment';
import {useRef} from 'react';
import {debounce} from 'lodash/fp';

import cx from './index.less';
import FormikComp from '../../../../components/FormikComp';
import useAddOrEditCron from './hook';
import {CRON_DATE_WEEKS, STRATEGIES} from '../../constant';
import NoahDetail from './NoahDetail';
import {loadMoreCallBackByScrolling} from '../../../../utils';

const AddOrEditCron = props => {
    const {
        visible,
        setVisible,
        onClose,
        editing,
        noah,
        noahDetail,
        getNoahList,
        getNoahWorkPlanDetail,
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
        handleCancel,
        onNoahSelectSearch,
        noahSearchName,
    } = useAddOrEditCron({
        noah,
        noahDetail,
        editing,
        editDetailId,
        getNoahList,
        getNoahWorkPlanDetail,
        setVisible,
        visible,
    });

    let formRef = useRef();
    const {list, currentPage} = noah;

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

    const isLoop = initialValues?.exePolicy === STRATEGIES.LOOP.value;

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
                .required('请输入任务名称'),
        },
        exePolicy: {
            label: '执行策略',
            name: 'exePolicy',
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
            validate: null,
        },
        datePickerForLoop: {
            label: '日期选择',
            name: 'datePicker',
            required: isLoop,
            hide: !isLoop,
            children: ({field, form: {values}}) => {
                return (
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
                            defaultValue={editing ? values.datePicker : [CRON_DATE_WEEKS[0].value]}
                            value={initialValues.datePicker}
                            onChange={e => handleChangeDatePicker(e, values)}
                        />
                    </div>
                );
            },
            validate: yup
                .array()
                .min(1, '请至少选择选择一个日期'),
        },
        datePickerForSingle: {
            label: '日期选择',
            name: 'timePicker',
            required: !isLoop,
            hide: isLoop,
            children: ({form: {values}}) => {
                return (
                    <DatePicker
                        defaultValue={editing ? moment(Number(values.timerPicker)) : moment()}
                        className={cx('single-picker')}
                        allowClear={false}
                        showTime
                        // onChange={() => {}}
                        onOk={e => {
                            setFormValues({
                                ...values,
                                timerPicker: e.valueOf(),
                            });
                        }}
                        format={STRATEGIES.SINGLE.format}
                    />
                );
            },
        },
        // 执行时间
        timerPicker: {
            label: '执行时间',
            name: 'timerPicker',
            required: isLoop,
            hide: !isLoop,
            children: ({form: {values}}) => {
                return (
                    <TimePicker
                        allowClear={false}
                        showNow={false}
                        suffixIcon={null}
                        defaultValue={editing ? moment(Number(values.timerPicker)) : moment()}
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
            validate: isLoop ? yup.string().required('请选择执行时间') : null,
        },
        // 作业方案
        workId: {
            label: '作业方案',
            name: 'workId',
            required: true,
            children: ({field, form: {values}}) => {
                const noahDetailProps = {
                    noahDetail: convertedNoahDetail,
                    noahOriginalDetail: noahDetail,
                };
                const workPlanSelectProps = {
                    options: list?.map(item => {
                        const {name, id} = item;
                        return {label: name, value: id, key: id};
                    }),
                    getPopupContainer: triggerNode => triggerNode.parentNode,
                    className: cx('noah-list-select'),
                    optionFilterProp: 'label',
                    placeholder: '请选择作业方案',
                    showSearch: true,
                    allowClear: true,
                    onSearch: onNoahSelectSearch,
                    onChange: e => handleChangeNoah(e, values),
                    onPopupScroll: debounce(250)(e => {
                        loadMoreCallBackByScrolling(
                            e,
                            {dispatch: getNoahList, currentPage, params: {name: noahSearchName}});
                    }),
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
        handleSubmit,
        initialValues,
        disabled,
        setDisabled,
        formFields,
        handleCancel,
        transformRef: form => {
            formRef.current = form;
        },
    };

    return (
        <Drawer
            title={<Title />}
            width={720}
            placement="right"
            onClose={onClose}
            visible={visible}
        >
            {visible && <FormikComp {...formikProps} />}
        </Drawer>
    );
};
export default AddOrEditCron;
