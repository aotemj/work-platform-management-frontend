import {useCallback, useEffect, useState} from 'react';
import {message, Modal} from 'antd';

import {debounce, getContainerDOM, getUrlPrefixReal} from '../../../utils';
import {DROP_DOWN_MENU, URLS} from './constants';
import {DEFAULT_PAGINATION, REQUEST_CODE, REQUEST_METHODS, SPLIT_SYMBOL, URL_PREFIX1} from '../../../constant';
import {useNavigate} from 'react-router-dom';
import {routes} from '../../../routes';
import {request} from '../../../request/fetch';

const useNoahList = getUsersFromOne => {
    const navigate = useNavigate();
    const [data, setData] = useState(DEFAULT_PAGINATION);
    // 方案名过滤
    const [searchValue, setSearchValue] = useState('');
    // 方案类型过滤
    const [noahType, setNoahType] = useState(null);
    const [loading, setLoading] = useState(false);
    // 批量选择 key
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // 批量选择
    const [selectRows, setSelectRows] = useState([]);

    const [shouldUpdate, setShouldUpdate] = useState(false);

    const [noahTypes, setNoahTypes] = useState([]);

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
            const res = await request({
                // currentPage	当前页	query	false   integer(int32)
                // name	方案名称	query	false   string
                // pageSize	每页数据条数	query	false   integer(int32)
                // typeId	方案分类ID	query	false   integer(int32)
                // useTemp	是否为临时方案	query	false   integer(int32)
                // userName	创建人用户名	query	false   string
                url: `${URL_PREFIX1}${URLS.LIST}`,
                params: {
                    currentPage: pageNum,
                    pageSize,
                    // TODO 作业类型字段
                    name: searchValue,
                    // typeId: noahType === allType.id ? '' : noahType,
                    typeId: noahType,
                },
            });
            const {code, data: result} = res;
            setLoading(false);
            if (code === REQUEST_CODE.SUCCESS) {
                const {list = [], total} = result;
                updateData({
                    list: list.map(item => ({...item, key: item.id})),
                    total,
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setShouldUpdate(false);
        }
    }, [shouldUpdate, data, searchValue, noahType, updateData]);

    // 获取类型列表
    const getNoahTypes = useCallback(async () => {
        const res = await request({
            url: `${URL_PREFIX1}${URLS.CATEGORY}`,
            params: {
                currentPage: 1,
                name: '',
                pageSize: 1000,
            },
        });
        const {code, data: {list}} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            setNoahTypes(list);
        }
    }, []);

    const executeNoah = useCallback(() => {}, []);
    // 编辑作业
    // TODO id 动态化
    const editNoah = useCallback((detail = {'id': 1}) => {
        navigate(routes.NOAH_EDIT.getUrl(detail.id));
    }, [navigate]);

    const addNoah = useCallback(() => {
        navigate(`${getUrlPrefixReal()}/${routes.NOAH_ADD.url}`);
    }, [navigate]);

    const individualDelete = useCallback(async noahId => {
        const res = await request({
            url: `${URL_PREFIX1}${URLS.INDIVIDUAL_DELETE}${noahId}`,
            method: REQUEST_METHODS.DELETE,
        });
        const {code} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            message.success('操作成功');
            setShouldUpdate(true);
        }
    }, []);

    const deleteByPatch = useCallback(async idList => {
        const res = await request({
            url: `${URL_PREFIX1}${URLS.DELETE_BY_BATCH}${idList.join(SPLIT_SYMBOL)}`,
            method: REQUEST_METHODS.DELETE,
        });
        const {code} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            message.success('操作成功');
            setShouldUpdate(true);
        }
    }, []);
    // 删除作业
    const removeNoah = useCallback(e => {
        const {name, id} = e;
        Modal.confirm({
            title: `确定要删除作业${name}吗？`,
            getContainer: getContainerDOM,
            onOk: () => individualDelete(id),
        });
    }, [individualDelete]);

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
        if (!checkIfBatchesOperationIsValid()) {
            return false;
        }
        // TODO 批量执行
    }, [checkIfBatchesOperationIsValid]);

    // 批量删除
    const removeInBatches = useCallback(() => {
        if (!checkIfBatchesOperationIsValid()) {
            return false;
        }
        Modal.confirm({
            title: '确定要删除多个作业吗？',
            getContainer: getContainerDOM,
            onOk: () => deleteByPatch(selectedRowKeys),
        });
    }, [checkIfBatchesOperationIsValid, deleteByPatch, selectedRowKeys]);

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
        getUsersFromOne();
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
        setNoahType,
    };
};

export default useNoahList;
