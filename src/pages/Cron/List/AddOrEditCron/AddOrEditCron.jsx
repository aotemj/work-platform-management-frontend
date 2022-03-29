import {Drawer, Button, Input, Radio, DatePicker, Select} from '@osui/ui';
import * as yup from 'yup';
import moment from 'moment';

import cx from './index.less';
import FormikComp from '../../../../components/FormikComp';
import useAddOrEditCron from './hook';
import {STRATEGIES} from './constant';
import LoopExecute from './LoopExecute';
import NoahDetail from './NoahDetail';

const AddOrEditCron = ({
    visible,
    onClose,
    editing,
    getNoahList,
    noahList,
    noahTotal,
    getNoahWorkPlanDetail,
    noahDetail,
}) => {
    const Title = () => {
        return (
            <div className={cx('cron-add-header')}>
                <div className={cx('left')}>
                    {editing ? '编辑定时任务' : '新建定时任务'}
                </div>
                <div className={cx('right')}>
                    <Button danger>删除</Button>
                    <Button type={'primary'}>保存</Button>
                </div>
            </div>
        );
    };

    const {
        disabled,
        setDisabled,
        formikValues,
        editValues,
        setFormikValues,
        setEditValues,
        handleChangeDate,
        handleChangeNoah,
        convertedNoahDetail,
    } = useAddOrEditCron({
        getNoahList,
        noahList,
        noahTotal,
        getNoahWorkPlanDetail,
        noahDetail,
    });
    const setFormValues = e => {
        return editing ? setEditValues(e) : setFormikValues(e);
    };

    const workPlanSelectProps = {
        options: noahList.map(item => {
            const {name, id} = item;
            return {label: name, value: id, key: id};
        }),
        getPopupContainer: triggerNode => triggerNode.parentNode,
        className: cx('noah-list-select'),
        placeholder: '请选择脚本',
        showSearch: true,
        allowClear: true,
        // disabled: isViewing,
        onChange: handleChangeNoah,
        // value: '',
    };

    const formFields = {
        name: {
            label: '任务名称',
            name: 'name',
            required: true,
            MAX_LENGTH: 80,
            children: ({field}) => {
                const maxLength = formFields.name.MAX_LENGTH;
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
                const {value} = field;
                const isLoop = value === STRATEGIES.LOOP.value;
                return (
                    <div className={cx('strategy-container')}>
                        <Radio.Group
                            {...field}
                            // disabled={isViewing}
                            options={Object.values(STRATEGIES).filter(item => !item.disabled)}
                            onChange={e => {
                                setFormValues({
                                    ...values,
                                    exePolicy: e.target.value,
                                });
                            }}
                            optionType="button"
                        />
                        {/* 周期执行 */}
                        <div className={cx('strategy-operation')}>
                            {
                                isLoop ? <LoopExecute />
                                    // 单次执行  精确到分钟
                                    : (
                                        <DatePicker
                                            defaultValue={moment()}
                                            className={cx('single-picker')}
                                            allowClear={false}
                                            showTime
                                            onChange={() => {}}
                                            onOk={() => {}}
                                            format={STRATEGIES.SINGLE.format}
                                        />
                                    )
                            }
                        </div>
                    </div>
                );
            },
            validate: yup.string().ensure().trim().required('请选择执行时间'),
        },
        // 作业方案
        workId: {
            label: '作业方案',
            name: 'workId',
            required: true,
            children: ({field}) => {
                return (
                    <div className={cx('work-id-field')}>
                        <Select {...workPlanSelectProps} />
                        {/* 已选择的作业方案  */}
                        <NoahDetail noahDetail={convertedNoahDetail} />
                    </div>
                );
            },
        },
    };
    const formikProps = {
        handleSubmit: () => {},
        initialValues: editValues || formikValues,
        disabled,
        setDisabled,
        formFields,
        handleCancel: () => {},
        okText: '保存',
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
