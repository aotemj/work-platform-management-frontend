import {useCallback, useEffect, useState} from 'react';

import {STRATEGIES} from './constant';
import {debounce} from 'lodash/fp';
import {deConvertParams} from '../../../../utils/convertNoahDetail';

const defaultFormikValues = {
    name: '',
    // 执行策略
    // exePolicy: STRATEGIES.SINGLE.value,
    exePolicy: STRATEGIES.LOOP.value,
};
const useAddOrEditCron = ({
    getNoahList,
    noahList,
    noahTotal,
    getNoahWorkPlanDetail,
    noahDetail,
}) => {
    const [disabled, setDisabled] = useState(true);
    const [formikValues, setFormikValues] = useState(defaultFormikValues);
    const [editValues, setEditValues] = useState(null);
    const [convertedNoahDetail, setConvertedNoahDetail] = useState(null);
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

    const handleChangeNoah = useCallback(e => {
        getNoahWorkPlanDetail(e);
    }, [getNoahWorkPlanDetail]);

    useEffect(() => {
        if (noahDetail) {
            const {
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
    }, []);

    return {
        disabled,
        setDisabled,
        formikValues,
        editValues,
        setFormikValues,
        setEditValues,
        handleChangeDate,
        handleChangeNoah,
        convertedNoahDetail,
    };
};

export default useAddOrEditCron;
