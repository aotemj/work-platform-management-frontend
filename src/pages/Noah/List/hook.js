import {useCallback, useEffect, useRef, useState} from 'react';
import {message, Modal} from '@osui/ui';
import {debounce} from 'lodash/fp';
import {useNavigate} from 'react-router-dom';

import {getContainerDOM, getUrlPrefixReal} from '../../../utils';
import {DROP_DOWN_MENU, URLS} from './constants';
import {
    DEFAULT_PAGINATION,
    REQUEST_CODE,
    REQUEST_METHODS,
    SPLIT_SYMBOL,
    COMMON_URL_PREFIX,
    MILLI_SECOND_STEP,
} from '../../../constant';
import {routes} from '../../../routes';
import {request} from '../../../request/fetch';

const useNoahList = ({getNoahList, noahList: list, noahTotal: total}) => {
    const navigate = useNavigate();
    const jumpTimer = useRef();
    const [batchSpin, setBatchSpin] = useState(false);
    const [data, setData] = useState({DEFAULT_PAGINATION, list, total});
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

    const updateData = newData => {
        setData({
            ...data,
            ...newData,
        });
    };

    const onSelectChange = useCallback((keys, selectedRows) => {
        setSelectedRowKeys(keys);
        setSelectRows(selectedRows);
    }, []);

    const getList = async () => {
        if (!shouldUpdate) {
            return false;
        }
        const {current, pageSize} = data;

        setLoading(true);
        await getNoahList({
            currentPage: current,
            pageSize,
            name: searchValue,
            // typeId: noahType === allType.id ? '' : noahType,
            typeId: noahType,
        });
        setLoading(false);
        setShouldUpdate(false);
    };

    // 获取类型列表 // 暂时不做分页
    const getNoahTypes = async () => {
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.CATEGORY}`,
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
    };
    // 单个执行作业
    const executeNoah = useCallback(async noahItem => {
        navigate(routes.NOAH_PRE_EXECUTING.getUrl(noahItem.id));
    }, [navigate]);
    // 编辑作业
    const editNoah = useCallback((detail = {'id': 1}) => {
        navigate(routes.NOAH_EDIT.getUrl(detail.id));
    }, [navigate]);

    const addNoah = useCallback(() => {
        navigate(`${getUrlPrefixReal()}/${routes.NOAH_ADD.url}`);
    }, [navigate]);

    const individualDelete = useCallback(async noahId => {
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.INDIVIDUAL_DELETE}${noahId}`,
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
            url: `${COMMON_URL_PREFIX}${URLS.DELETE_BY_BATCH}${idList.join(SPLIT_SYMBOL)}`,
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

    const executeByBatch = useCallback(async idList => {
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.EXECUTE_BY_BATCH}${idList.join(SPLIT_SYMBOL)}`,
            method: REQUEST_METHODS.POST,
        });
        const {code} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            message.success('操作成功');
            setShouldUpdate(true);
            setBatchSpin(true);
            jumpTimer.current = setTimeout(
                () => {
                    setBatchSpin(false);
                    navigate(`${getUrlPrefixReal()}/${routes.EXEC_LIST.url}`);

                },
                MILLI_SECOND_STEP * 5,
            );
        }
    }, [navigate]);
    // 批量执行
    const executeInBatch = useCallback(() => {
        if (!checkIfBatchesOperationIsValid()) {
            return false;
        }
        Modal.confirm({
            title: `确定要批量执行这${selectedRowKeys.length}个作业吗？`,
            getContainer: getContainerDOM,
            onOk: () => executeByBatch(selectedRowKeys),
        });
    }, [checkIfBatchesOperationIsValid, executeByBatch, selectedRowKeys]);

    // 批量删除
    const removeInBatch = useCallback(() => {
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
                executeInBatch();
                break;
            case REMOVE.key:
                removeInBatch();
                break;
        }
    }, [executeInBatch, removeInBatch]);

    // 作业类型筛选 change event
    const handleChange = e => {
        setNoahType(e || '');
    };

    // 作业类型筛选 change event
    const handleChangeInput = e => {
        setSearchValue(e);
    };

    // 更新页码
    const handlePaginationChange = debounce(500)((current, pageSize = DEFAULT_PAGINATION.pageSize) => {
        updateData({
            current,
            pageSize,
        });
        setShouldUpdate(true);
    });

    // 根据关键字、类型重置页码
    useEffect(() => {
        handlePaginationChange(1);
    }, [searchValue, noahType]);

    useEffect(() => {
        updateData({
            list,
            total,
        });
    }, [list, total]);

    useEffect(() => {
        getList();
    }, [shouldUpdate]);

    // initialize
    useEffect(() => {
        getNoahTypes();
        return () => {
            clearTimeout(jumpTimer);
        };
    }, []);

    return {
        data,
        handlePaginationChange,
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
        batchSpin,
    };
};

export default useNoahList;
