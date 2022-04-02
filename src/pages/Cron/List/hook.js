import {useCallback, useEffect, useState} from 'react';
import {message, Modal} from '@osui/ui';
import {reject, anyPass, isEmpty, isNil} from 'ramda';
import {debounce} from 'lodash/fp';

import {getContainerDOM, requestCallback} from '../../../utils';
import {request} from '../../../request/fetch';
import {COMMON_URL_PREFIX, DEFAULT_PAGINATION, REQUEST_METHODS} from '../../../constant';
import {URLS} from '../constant';

const useCronList = () => {
    // Table加载状态
    const [loading, setLoading] = useState(false);
    // Table显示数据
    const [data, setData] = useState(DEFAULT_PAGINATION);
    // 搜索及列表请求参数
    const [searchValue, setSearchValue] = useState({
        currentPage: DEFAULT_PAGINATION.current,
        pageSize: DEFAULT_PAGINATION.pageSize,
        userName: '',
        beginTime: '',
        endTime: '',
    });

    const [addOrEditDrawerVisible, setAddOrEditDrawerVisible] = useState(false);

    const [editDetailId, setEditDetailId] = useState(null);

    const [editing, setEditing] = useState(false);

    // 表格请求参数
    const getList = async () => {
        const params = reject(anyPass([isEmpty, isNil]))(searchValue);
        setLoading(true);
        try {
            const res = await request({
                url: `${COMMON_URL_PREFIX}${URLS.CRON_LIST_URL}`,
                params: params,
            });
            const {status, data, msg} = res;
            if (!status) {
                const {list = [], total, currentPage, pageSize} = data;
                setData(data => ({
                    ...data,
                    list,
                    total,
                    pageSize,
                    current: currentPage,
                }));
            } else {
                message.error(msg);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // 更新currentPage、pageSize
    const handlePaginationChange = debounce(500)((currentPage = 1, pageSize = 10) => {
        setSearchValue(value => ({
            ...value,
            currentPage,
            pageSize,
        }));
    });

    // 输入关键字筛选 userName
    const handleChangeInput = debounce(500)(e => {
        setSearchValue(value => ({
            ...value,
            userName: e,
        }));
    });

    // 日期变化 beginTime endTime
    const handleChangeDate = debounce(500)(({beginTime, endTime}) => {
        setSearchValue(value => ({
            ...value,
            beginTime,
            endTime,
        }));
    });
    // 添加 cron
    const handleAddCron = useCallback(() => {
        setEditing(false);
        setAddOrEditDrawerVisible(true);
        setEditDetailId(null);
    }, []);
    // 删除单个 cron
    const deleteCron = record => {
        const {cronExecute: {id, taskName}} = record;
        Modal.confirm({
            title: `确定要删除定时任务${taskName}吗？`,
            getContainer: getContainerDOM,
            onOk: debounce(500)(async () => {
                const res = await request({
                    method: REQUEST_METHODS.DELETE,
                    url: `${COMMON_URL_PREFIX}${URLS.DELETE_CRON_ITEM}${id}`,
                });
                requestCallback({
                    res,
                    callback() {
                        getList();
                    },
                });
            }),
        });
    };

    // 编辑 cron
    const editCron = record => {
        const {cronExecute: {id}} = record;
        setEditing(true);
        setEditDetailId(id);
    };

    /* 手动切换定时任务启停状态
        任务停用启用逻辑 from product manager
        6.1 周期性任务可以正常停用和启用
        6.2 单次任务在任务没有执行前，可以停用。在任务执行完毕无能在启用
    */
    const handleChangeCronByManual = (val, record) => {
        // console.log(val, record);
    };

    // Initialize 初始化
    useEffect(() => {
        if (!addOrEditDrawerVisible) {
            getList();
            setEditDetailId(null);
            setEditing(false);
        }
    }, [searchValue, addOrEditDrawerVisible]);

    return {
        data,
        loading,
        handleChangeInput,
        handleChangeDate,
        handlePaginationChange,
        addOrEditDrawerVisible,
        setAddOrEditDrawerVisible,
        handleAddCron,
        deleteCron,
        handleChangeCronByManual,
        editCron,
        editing,
        editDetailId,
    };
};

export default useCronList;
