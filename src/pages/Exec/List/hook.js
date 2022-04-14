import {useCallback, useEffect, useRef, useState} from 'react';
import {Modal} from '@osui/ui';
import {reject, anyPass, isEmpty, isNil} from 'ramda';
import {debounce} from 'lodash/fp';

import {getContainerDOM, requestCallback, Toast} from '../../../utils';
import {request} from '../../../request/fetch';
import {
    DEFAULT_PAGINATION,
    MILLI_SECOND_STEP,
    REQUEST_METHODS,
    COMMON_URL_PREFIX,
} from '../../../constant';
import {URLS} from './constant';

const useExecList = getExecutionDetail => {
    let loopTimer = useRef();
    let reTryTimer = useRef();

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
    // 当前选中查看详情 执行 id
    const [currentExecutionId, setCurrentExecutionId] = useState(null);

    const [executeDetailVisible, setExecuteDetailVisible] = useState(false);

    const [needLoopDetail, setNeedLoopDetail] = useState(true);

    // 表格请求参数
    const getList = useCallback(async () => {
        const params = reject(anyPass([isEmpty, isNil]))(searchValue);
        setLoading(true);
        try {
            const res = await request({
                url: `${COMMON_URL_PREFIX}${URLS.EXEC_LIST_URL}`,
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
                Toast.error(msg);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [searchValue]);

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

    const getDetailId = () => {
        const search = new URL(window.location.href).search;
        const searchParams = new URLSearchParams(search);
        const detailId = searchParams.has('id') ? searchParams.get('id') : null;
        if (detailId) {
            setCurrentExecutionId(detailId);
        }
    };

    // 查看执行详情
    const handleViewDetail = useCallback(e => {
        const {id} = e;
        setCurrentExecutionId(id);
    }, []);

    const getDetailInfo = useCallback(async () => {
        clearTimeout(loopTimer.current);

        if (!currentExecutionId) {
            return;
        }
        setNeedLoopDetail(false);
        try {
            await getExecutionDetail(currentExecutionId);
            loopTimer.current = setTimeout(() => {
                setNeedLoopDetail(true);
            }, 5 * MILLI_SECOND_STEP);
        } catch (e) {
            clearTimeout(loopTimer.current);
            setExecuteDetailVisible(false);
            Toast.error('获取详情失败');
        }
    }, [currentExecutionId, getExecutionDetail]);

    // 重新执行
    const reExecution = useCallback(async item => {
        Modal.confirm({
            title: '确定要重新执行当前记录吗？',
            getContainer: getContainerDOM,
            onOk: async () => {
                const {id} = item;
                const res = await request({
                    url: `${COMMON_URL_PREFIX}${URLS.RE_EXECUTE}${id}`,
                    method: REQUEST_METHODS.POST,
                });
                requestCallback({
                    res,
                    callback() {
                        reTryTimer.current = setTimeout(getList, MILLI_SECOND_STEP * 3);
                    },
                });
            },
        });
    }, [getList]);
    // Initialize 初始化
    useEffect(() => {
        if (!executeDetailVisible) {
            getList();
        }
    }, [searchValue, executeDetailVisible]);

    useEffect(() => {
        if (currentExecutionId) {
            setExecuteDetailVisible(true);
        }
    }, [currentExecutionId]);

    useEffect(() => {
        getDetailId();
        return () => {
            clearTimeout(reTryTimer);
            clearTimeout(loopTimer);
        };
    }, []);

    // 轮询当前详情接口 start
    useEffect(() => {
        if (executeDetailVisible) {
            setNeedLoopDetail(true);
        } else {
            clearTimeout(loopTimer.current);
            setNeedLoopDetail(false);
        }
    }, [executeDetailVisible]);

    useEffect(() => {
        if (needLoopDetail) {
            getDetailInfo();
        }
    }, [needLoopDetail]);
    // 轮询当前详情接口 end

    return {
        data,
        loading,
        handleChangeInput,
        handleChangeDate,
        handlePaginationChange,
        handleViewDetail,
        executeDetailVisible,
        setExecuteDetailVisible,
        // executionDetail,
        reExecution,
        submitCallback: getDetailInfo,
        setCurrentExecutionId,
    };
};

export default useExecList;
