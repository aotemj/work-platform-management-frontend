import {useCallback, useEffect, useState} from 'react';
import {message} from 'antd';

import {debounce, requestForAgn} from '../../../utils';
import {LIST_URL} from '../../../utils/api';
import {DEFAULT_PAGINATION} from '../../../constant';
import {useNavigate} from 'react-router-dom';
import {routes} from '../../../routes';

const useNoahList = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(DEFAULT_PAGINATION);
    // 方案名过滤
    const [searchValue, setSearchValue] = useState('');
    // 方案类型过滤
    const [noahType, setNoahType] = useState('all');
    const [loading, setLoading] = useState(false);

    const [shouldUpdate, setShouldUpdate] = useState(false);


    const updateData = useCallback(newData => {
        setData({
            ...data,
            ...newData,
        });
    }, [data]);


    // 这里考虑 searchValue 可能会频繁变更，所以不将其放到 dependencyList 里面，而是当做参数传入
    const getList = useCallback(async () => {
        if (!shouldUpdate) {
            return false;
        }
        const {pageNum, pageSize} = data;
        setLoading(true);
        try {
            const res = await requestForAgn({
                url: LIST_URL, params: {
                    _offset: pageNum,
                    _limit: pageSize,
                    // TODO 作业类型字段
                    keyword: searchValue,
                    select: noahType,
                },
            });
            const {status, result, msg} = res;
            setLoading(false);
            if (!status) {
                const {content: list = [{}, {}], totalElements: total} = result;
                updateData({
                    list,
                    total,
                });
            } else {
                message.error(msg);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setShouldUpdate(false);
        }
    }, [shouldUpdate, data, searchValue, noahType, updateData]);

    // 获取类型列表
    const getNoahTypes = useCallback(async () => {

    }, []);

    const executeNoah = useCallback(() => {}, []);
    // 编辑作业
    // TODO id 动态化
    const editNoah = useCallback((detail = {'id': 1}) => {
        navigate(routes.NOAH_EDIT.getUrl(detail.id));
    }, []);

    // 作业类型筛选 change event
    const handleChangeInput = useCallback(e => {
        setSearchValue(e);
    }, []);

    // 更新页码
    const handlePaginationChange = useCallback(debounce((pageNum = 1) => {
        updateData({
            pageNum,
        });
        setShouldUpdate(true);
    }, 500), []);

    // 根据关键字、类型重置页码
    useEffect(() => {
        handlePaginationChange();
    }, [searchValue, noahType]);

    useEffect(() => {
        getList();
    }, [shouldUpdate]);

    // initialize
    useEffect(() => {
        getNoahTypes();
    }, []);

    return {
        data,
        handlePaginationChange,
        handleChangeInput,
        loading,
        executeNoah,
        editNoah,
    };
};

export default useNoahList;
