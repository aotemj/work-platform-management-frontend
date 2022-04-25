import {useEffect, useRef, useState} from 'react';
import {Modal} from '@osui/ui';
import {useNavigate} from 'react-router-dom';
import urlJoin from 'url-join';

import {
    assembleRequestUrl,
    debounceWith500ms,
    diskWarning,
    generateFullPath,
    getContainerDOM,
    Toast,
} from '../../../utils';
import {DROP_DOWN_MENU, URLS} from './constants';
import {
    DEFAULT_PAGINATION,
    REQUEST_CODE,
    REQUEST_METHODS,
    SPLIT_SYMBOL,
    MILLI_SECOND_STEP,
    DEFAULT_SUCCESS_MESSAGE,
} from '../../../constant';
import {routes} from '../../../routes';
import {request} from '../../../request/fetch';

const useNoahList = ({
    getNoahList,
    noah: {
        list,
        total,
    },
    updateDiskSpaceInfo,
    diskSpaceInfo,
    getCategoryList,
}) => {
    const navigate = useNavigate();
    const jumpTimer = useRef();
    const [batchSpin, setBatchSpin] = useState(false);
    const [data, setData] = useState({...DEFAULT_PAGINATION, list, total});
    // 方案名过滤
    const [noahName, setNoahName] = useState('');
    // 方案类型过滤
    const [noahType, setNoahType] = useState(null);

    // 批量选择 key
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    // 批量选择
    const [selectRows, setSelectRows] = useState([]);

    const [shouldUpdate, setShouldUpdate] = useState(false);

    const [categorySearchName, setCategorySearchName] = useState('');

    const updateData = newData => {
        setData({
            ...data,
            ...newData,
        });
    };

    const onSelectChange = (keys, selectedRows) => {
        setSelectedRowKeys(keys);
        setSelectRows(selectedRows);
    };

    const getList = async () => {
        if (!shouldUpdate) {
            return false;
        }
        const {current, pageSize} = data;

        getNoahList({
            currentPage: current,
            pageSize,
            name: noahName,
            // typeId: noahType === allType.id ? '' : noahType,
            typeId: noahType,
        });
        setShouldUpdate(false);
    };

    // 单个执行作业
    const executeNoah = ({id: detailId}) => navigate(generateFullPath(routes.NOAH_PRE_EXECUTING.path, {detailId}));
    // 编辑作业
    const editNoah = ({id: detailId}) => navigate(generateFullPath(routes.NOAH_EDIT.path, {detailId}));

    const addNoah = () => navigate(generateFullPath(routes.NOAH_ADD.path));

    const individualDelete = async noahId => {
        const res = await request({
            url: assembleRequestUrl(URLS.INDIVIDUAL_DELETE.expand({noahId})),
            method: REQUEST_METHODS.DELETE,
        });
        const {code} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            Toast.success(DEFAULT_SUCCESS_MESSAGE);
            setShouldUpdate(true);
        }
    };

    const deleteByPatch = async idList => {
        const res = await request({
            url: assembleRequestUrl(urlJoin(URLS.DELETE_BY_BATCH, idList.join(SPLIT_SYMBOL))),
            method: REQUEST_METHODS.DELETE,
        });
        const {code} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            Toast.success(DEFAULT_SUCCESS_MESSAGE);
            setShouldUpdate(true);
        }
    };
    // 删除作业
    const removeNoah = e => {
        const {name, id} = e;
        Modal.confirm({
            title: `确定要删除作业${name}吗？`,
            getContainer: getContainerDOM,
            onOk: () => individualDelete(id),
        });
    };

    const checkIfBatchesOperationIsValid = () => {
        const length = selectedRowKeys.length;
        const valid = length !== 0;
        if (!valid) {
            Toast.error('请至少选择一个项目');
        }
        return valid;
    };

    const executeByBatch = async idList => {
        const res = await request({
            url: assembleRequestUrl(urlJoin(URLS.EXECUTE_BY_BATCH, idList.join(SPLIT_SYMBOL))),
            method: REQUEST_METHODS.POST,
        });
        const {code} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            Toast.success(DEFAULT_SUCCESS_MESSAGE);
            setShouldUpdate(true);
            setBatchSpin(true);
            jumpTimer.current = setTimeout(
                () => {
                    setBatchSpin(false);
                    navigate(generateFullPath(routes.EXEC_LIST.path));
                },
                MILLI_SECOND_STEP * 5,
            );
        }
    };

    // 批量执行
    const executeInBatch = () => {
        if (!checkIfBatchesOperationIsValid()) {
            return false;
        }
        Modal.confirm({
            title: `确定要批量执行这${selectedRowKeys.length}个作业吗？`,
            getContainer: getContainerDOM,
            onOk: () => executeByBatch(selectedRowKeys),
        });
    };

    // 批量删除
    const removeInBatch = () => {
        if (!checkIfBatchesOperationIsValid()) {
            return false;
        }
        Modal.confirm({
            title: '确定要删除多个作业吗？',
            getContainer: getContainerDOM,
            onOk: () => deleteByPatch(selectedRowKeys),
        });
    };

    // 菜单点击
    const handleMenuClick = e => {
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
    };

    // 作业类型筛选 change event
    const handleChange = e => {
        setNoahType(e || '');
    };

    // 作业类型筛选 change event
    const handleChangeInput = e => {
        setNoahName(e);
    };

    // 更新页码
    const handlePaginationChange = debounceWith500ms((current, pageSize = DEFAULT_PAGINATION.pageSize) => {
        updateData({
            current,
            pageSize,
        });
        setShouldUpdate(true);
    });

    const onCategorySearchCallback = debounceWith500ms(e => {
        setCategorySearchName(e);
    });

    // 根据关键字、类型重置页码
    useEffect(() => {
        handlePaginationChange(1);
    }, [noahName, noahType]);

    useEffect(() => {
        updateData({
            list,
            total,
        });
    }, [list, total]);

    useEffect(() => {
        getList();
    }, [shouldUpdate]);

    useEffect(() => {
        diskWarning(diskSpaceInfo);
    }, [diskSpaceInfo]);

    useEffect(() => {
        getCategoryList({
            currentPage: 1,
            name: categorySearchName,
        });
    }, [categorySearchName]);

    // initialize
    useEffect(() => {
        updateDiskSpaceInfo();
        return () => {
            clearTimeout(jumpTimer);
        };
    }, []);

    return {
        data,
        handlePaginationChange,
        handleChange,
        handleChangeInput,
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
        // 当前选中类型
        noahType,
        addNoah,
        setNoahType,
        batchSpin,
        onCategorySearchCallback,
        categorySearchName,
    };
};

export default useNoahList;
