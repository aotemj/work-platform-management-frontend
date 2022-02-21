import {useCallback, useEffect, useState} from 'react';
import {message} from 'antd';

import {debounce, requestForAgn} from '../../../utils';
import {LIST_URL} from '../../../utils/api';
import {DROP_DOWN_MENU} from './constants';
import {DEFAULT_PAGINATION, ROUTE_PREFIX} from '../../../constant';
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
    // 批量选择 key
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // 批量选择
    const [selectRows, setSelectRows] = useState([]);

    const [shouldUpdate, setShouldUpdate] = useState(false);

    const [noahTypes, setNoahTypes] = useState([{name: '全部', id: 'all', tag: 'all'}]);

    const updateData = useCallback(newData => {
        setData({
            ...data,
            ...newData,
        });
    }, [data]);

    const onSelectChange = useCallback((keys, selectedRows) => {
        setSelectedRowKeys(keys);
        setSelectRows(selectedRows);
    }, []);

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
    }, [data, searchValue, noahType, shouldUpdate]);

    // 获取类型列表
    const getNoahTypes = useCallback(async () => {

    }, []);

    const executeNoah = useCallback(() => {}, []);
    // 编辑作业
    // TODO id 动态化
    const editNoah = useCallback((detail = {'id': 1}) => {
        navigate(routes.NOAH_EDIT.getUrl(detail.id));
    }, []);

    const addNoah = useCallback(() => {
        navigate(`${ROUTE_PREFIX}/${routes.NOAH_ADD.url}`);
    }, []);

    // 删除作业
    const removeNoah = useCallback(() => {

    }, []);

    const checkIfBatchesOperationIsValid = useCallback(() => {
        const length = selectedRowKeys.length;
        const valid = length !== 0;
        if (!valid) {
            message.error('请至少选择一个项目');
        }
        return valid;
    }, [selectedRowKeys]);

    // 批量执行
    const executeInBatches = useCallback(() => {
        if (checkIfBatchesOperationIsValid()) {
            return false;
        }
        // TODO 批量执行
    }, [checkIfBatchesOperationIsValid]);

    // 批量删除
    const removeInBatches = useCallback(() => {
        if (checkIfBatchesOperationIsValid()) {
            return false;
        }
        // TODO 批量删除
    }, [checkIfBatchesOperationIsValid]);

    // 菜单点击
    const handleMenuClick = useCallback(e => {
        const {key} = e;
        const {EXECUTING, REMOVE} = DROP_DOWN_MENU;
        switch (key) {
            case EXECUTING.key:
                executeInBatches();
                break;
            case REMOVE.key:
                removeInBatches();
                break;
        }
    }, [executeInBatches, removeInBatches]);

    const showDetail = useCallback(id => {
    }, []);

    // 作业类型筛选 change event
    const handleChange = useCallback(e => {
        setNoahType(e || '');
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
        showDetail,
        handleChange,
        handleChangeInput,
        loading,
        selectedRowKeys,
        onSelectChange,
        // 点击dropdownMenu
        handleMenuClick,
        // 执行作业
        executeNoah,
        // 编辑作业
        editNoah,
        // 删除作业
        removeNoah,
        // 筛选类型列表
        noahTypes,
        // 当前选中类型
        noahType,
        addNoah,
    };
};

export default useNoahList;
