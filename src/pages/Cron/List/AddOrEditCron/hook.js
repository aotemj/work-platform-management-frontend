import {useCallback, useEffect, useState} from 'react';
import moment from 'moment';

import {CRON_DATE_WEEKS, STRATEGIES} from '../../constant';
import {debounce} from 'lodash/fp';
import {deConvertParams} from '../../../../utils/convertNoahDetail';

const defaultFormikValues = {
    name: '',
    // 执行策略
    // exePolicy: STRATEGIES.SINGLE.value,
    exePolicy: STRATEGIES.LOOP.value,
    datePicker: [],
    // cron 表达式
    exeCron: '',
    timerPicker: moment().valueOf(),
};
const useAddOrEditCron = ({
    noahList,
    noahTotal,
    noahDetail,
    editing,
    getNoahList,
    getNoahWorkPlanDetail,
    getCategoryList,
}) => {
    const [disabled, setDisabled] = useState(true);
    const [formikValues, setFormikValues] = useState(defaultFormikValues);
    const [editValues, setEditValues] = useState(null);
    const [convertedNoahDetail, setConvertedNoahDetail] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [indeterminate, setIndeterminate] = useState(false);
    // const [] = useState();
    // 搜索及列表请求参数
    const [searchValue, setSearchValue] = useState({
        beginTime: '',
        endTime: '',
    });

    // 日期变化 beginTime endTime
    const handleChangeDate = debounce(500)(({beginTime, endTime}) => {
        setSearchValue(value => ({
            ...value,
            beginTime,
            endTime,
        }));
    });
    const setFormValues = e => {
        return editing ? setEditValues(e) : setFormikValues(e);
    };
    // 全选
    const handleChangeDatePicker = (e, values) => {
        const selectLength = e.length;
        const allLength = CRON_DATE_WEEKS.length;
        setFormValues({
            ...values,
            datePicker: e,
        });
        setIndeterminate(!!selectLength && selectLength < allLength);
        setSelectAll(selectLength === allLength);
    };

    const handleToggleCheckAll = (e, values) => {
        const {checked} = e.target;
        setFormValues({
            ...values,
            datePicker: checked ? CRON_DATE_WEEKS.map(item => item.value) : [],
        });
        setIndeterminate(false);
        setSelectAll(e.target.checked);
    };

    const handleChangeNoah = useCallback((e, values) => {
        if (e) {
            getNoahWorkPlanDetail(e);
        }
        setFormValues({
            ...values,
            workId: e ? e : null,
        });

    }, [getNoahWorkPlanDetail, setFormValues]);

    const handleSubmit = values => {
        console.log(values);
    };

    useEffect(() => {
        if (noahDetail) {
            const {
                handleChangeNoah,
                tempList,
                tempMap,
                tempParams,
            } = deConvertParams(noahDetail);
            setConvertedNoahDetail(tempParams);
            // setGlobalsVariables(tempList);
            // setVariableMap(tempMap);
            // setFormikValues(tempParams);
            // 查看模式赋值(不允许修改)
            // if (isViewing) {
            //     const currentStage = tempParams?.stageList?.filter(item => item.id === stageId)[0];
            //     setStepEditingValue(currentStage);
            // }
            // setDetailFromServer({
            //     sourceData: noahDetail,
            //     formattedFromFront: tempParams,
            //     sourceCategoryMap: handleSourceCategoryMap(noahDetail),
            // });
        }
    }, [noahDetail]);

    useEffect(() => {
        // TODO 滑动加载更多
        getNoahList({
            // currentPage,
            // pageSize,
        });
        getCategoryList();
    }, []);

    return {
        disabled,
        setDisabled,
        formikValues,
        editValues,
        handleChangeDate,
        handleChangeNoah,
        convertedNoahDetail,
        handleChangeDatePicker,
        handleToggleCheckAll,
        selectAll,
        indeterminate,
        setFormValues,
        handleSubmit,
    };
};

export default useAddOrEditCron;
