import {useCallback, useEffect, useState} from 'react';
import moment from 'moment';
import {Modal} from '@osui/ui';

import {CRON_DATE_WEEKS, STRATEGIES, URLS} from '../../constant';
import {deConvertParams} from '../../../../utils/convertNoahDetail';
import {
    COMMON_URL_PREFIX,
    DEFAULT_PAGINATION,
    PAGE_SIZE_OF_NO_PAGINATION,
    REQUEST_METHODS,
    SPLIT_SYMBOL,
    SYMBOL_FOR_ALL,
} from '../../../../constant';
import {request} from '../../../../request/fetch';
import {debounceWith250ms, getContainerDOM, requestCallback} from '../../../../utils';

const defaultFormikValues = {
    taskName: '', // 执行策略
    exePolicy: STRATEGIES.SINGLE.value,
    datePicker: [],
    exeCron: '', // cron 表达式
    timerPicker: moment().valueOf(),
};
const useAddOrEditCron = ({
    noahDetail,
    editing,
    getNoahList,
    getNoahWorkPlanDetail,
    setVisible,
    visible,
    editDetailId,
}) => {
    const [disabled, setDisabled] = useState(true);
    const [formikValues, setFormikValues] = useState(defaultFormikValues);
    const [editValues, setEditValues] = useState(null);
    const [convertedNoahDetail, setConvertedNoahDetail] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    const [noahSearchName, setNoahSearchName] = useState('');

    const setFormValues = e => {
        return editing ? setEditValues(e) : setFormikValues(e);
    };
    // 全选
    const handleChangeDatePicker = (e, values) => {
        const selectLength = e.length;
        const allLength = CRON_DATE_WEEKS.length;
        setFormValues({
            ...values, datePicker: e,
        });
        setIndeterminate(!!selectLength && selectLength < allLength);
        setSelectAll(selectLength === allLength);
    };

    const handleToggleCheckAll = (e, values) => {
        const {checked} = e.target;
        setFormValues({
            ...values, datePicker: checked ? CRON_DATE_WEEKS.map(item => item.value) : [],
        });
        setIndeterminate(false);
        setSelectAll(e.target.checked);
    };

    const handleChangeNoah = useCallback((e, values) => {
        if (e) {
            getNoahWorkPlanDetail(e);
        }
        setFormValues({
            ...values, workId: e ? e : null,
        });

    }, [getNoahWorkPlanDetail, setFormValues]);

    // 组装 cron 表达式
    const convertCronExpress = values => {
        const {exePolicy, datePicker, timerPicker} = values;
        const {LOOP, SINGLE} = STRATEGIES;

        // 暂不支持 修改 second， 这里 写死为 0
        const secondValue = '0';
        let weekValue = '';
        // 暂不支持 修改 month， 这里 写死为 *
        const monthValue = '*';
        // 暂不支持 修改 day， 这里 写死为 ?
        const dayValue = '?';
        let hourValue = '';
        let minuteValue = '';

        // 周期执行
        if (exePolicy === LOOP.value) {
            const length = datePicker.length;
            if (length === CRON_DATE_WEEKS.length) {
                weekValue = SYMBOL_FOR_ALL;
            } else {
                weekValue = datePicker.join(SPLIT_SYMBOL);
            }

            const date = new Date(Number(timerPicker));
            hourValue = date.getHours();
            minuteValue = date.getMinutes();
            return `${secondValue} ${minuteValue} ${hourValue} ${dayValue} ${monthValue} ${weekValue}`;
        } else if (exePolicy === SINGLE.value) {
            return String(values.timerPicker);
        }
    };

    const closingVisibleCallback = () => {
        setFormikValues(defaultFormikValues);
        setSelectAll(false);
        setIndeterminate(false);
        setEditValues(null);
    };

    const handleEditCron = async values => {
        const cronId = editDetailId;
        const {exePolicy, taskName, workId} = values;
        const exeCron = convertCronExpress(values);
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.EDIT_CRON}${cronId}`,
            method: REQUEST_METHODS.PUT,
            params: {
                exeCron, exePolicy, taskName, workId,
            },
        });

        requestCallback({
            res,
            callback() {
                setVisible(false);
            },
        });
    };

    const handleAddCron = async values => {
        const {exePolicy, taskName, workId} = values;
        const exeCron = convertCronExpress(values);
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.ADD_CRON}`, method: REQUEST_METHODS.POST, params: {
                exeCron, exePolicy, taskName, workId,
            },
        });
        requestCallback({
            res, callback() {
                setVisible(false);
            },
        });
    };

    const handleSubmit = values => {
        if (editing) {
            handleEditCron(values);
        } else {
            handleAddCron(values);
        }
    };

    const handleCancel = () => {
        Modal.confirm({
            title: '确定取消当前操作？',
            getContainer: getContainerDOM,
            onOk: () => {
                setVisible(false);
            },
        });
    };
    // 删除
    const handleRemove = () => {

    };

    const convertParams = originalData => {
        const {
            exeCron,
            exePolicy,
            taskName,
            workId,
        } = originalData;
        const [, minute, hour, , , week] = exeCron.split(' ');
        let timerPicker = moment().valueOf();
        let datePicker = [];
        const {LOOP, SINGLE} = STRATEGIES;
        // 周期
        if (exePolicy === LOOP.value) {

            const isAllSelect = week === SYMBOL_FOR_ALL;
            const selectLength = week.length;
            const allLength = CRON_DATE_WEEKS.length;
            datePicker = isAllSelect
                ? CRON_DATE_WEEKS.map(item => item.value)
                : week.split(SPLIT_SYMBOL).map(item => Number(item));
            setSelectAll(isAllSelect);
            setIndeterminate(isAllSelect ? false : !!selectLength && selectLength < allLength);

            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const date = new Date(year, month, day, hour, minute);
            timerPicker = date.getTime();
        } else if (SINGLE.value) {
            timerPicker = exeCron;
        }

        return {
            taskName,
            exePolicy,
            workId,
            timerPicker,
            datePicker,
        };
    };

    // 获取 cron 详情
    const getCronDetail = async detailId => {
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.GET_CRON_DETAIL}${detailId}`,
        });
        requestCallback({
            res,
            hideMessage: true,
            callback(data) {
                const params = convertParams(data);
                const {workId} = params;
                if (workId) {
                    getNoahWorkPlanDetail(workId);
                }
                setFormikValues(params);
                setVisible(true);
            },
        });
    };

    const onNoahSelectSearch = debounceWith250ms(e => {
        setNoahSearchName(e);
    });

    useEffect(() => {
        if (editDetailId) {
            getCronDetail(editDetailId);
        }
    }, [editDetailId]);

    useEffect(() => {
        if (noahDetail) {
            const {
                tempParams,
            } = deConvertParams(noahDetail);
            setConvertedNoahDetail(tempParams);
        }
    }, [noahDetail]);

    useEffect(() => {
        if (!visible) {
            closingVisibleCallback();
        } else {
            getNoahList({
                currentPage: 1,
                name: noahSearchName,
                // 解决编辑模式下作业id回显问题
                pageSize: editing ? PAGE_SIZE_OF_NO_PAGINATION : DEFAULT_PAGINATION.pageSize,
            });
        }
    }, [visible, noahSearchName]);

    return {
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
        handleRemove,
        visible,
        onNoahSelectSearch,
        noahSearchName,
        handleCancel,
    };
};

export default useAddOrEditCron;
