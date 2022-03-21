import {useCallback, useEffect, useRef, useState} from 'react';
import {message} from '@osui/ui';
import {reject, anyPass, isEmpty, isNil} from 'ramda';
// import {useNavigate} from 'react-router-dom';

import {debounce} from '../../../utils';
import {request} from '../../../request/fetch';
import {EXEC_LIST_URL} from '../../../utils/api';
import {DEFAULT_PAGINATION, REQUEST_CODE, REQUEST_METHODS, URL_PREFIX1} from '../../../constant';
import {URLS} from './constant';

const useExecList = () => {
    let loopTimer = useRef();

    // const navigate = useNavigate();
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
    // 执行详情
    const [executionDetail, setExecutionDetail] = useState(null);

    const [executeDetailVisible, setExecuteDetailVisible] = useState(false);

    const [needLoopDetail, setNeedLoopDetail] = useState(true);

    // 表格请求参数
    const getList = useCallback(async () => {
        const params = reject(anyPass([isEmpty, isNil]))(searchValue);
        setLoading(true);
        try {
            const res = await request({
                url: EXEC_LIST_URL,
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
    }, [searchValue]);

    // 更新currentPage、pageSize
    const handlePaginationChange = useCallback(
        debounce((currentPage = 1, pageSize = 10) => {
            setSearchValue(value => ({
                ...value,
                currentPage,
                pageSize,
            }));
        }, 500), []);

    // 输入关键字筛选 userName
    const handleChangeInput = useCallback(
        debounce(e => {
            setSearchValue(value => ({
                ...value,
                userName: e,
            }));
        }, 500), []);

    // 日期变化 beginTime endTime
    const handleChangeDate = useCallback(
        debounce(({beginTime, endTime}) => {
            setSearchValue(value => ({
                ...value,
                beginTime,
                endTime,
            }));
        }, 500), []);

    const getDetailId = useCallback(() => {
        const search = new URL(window.location.href).search;
        const searchParams = new URLSearchParams(search);
        const detailId = searchParams.has('id') ? searchParams.get('id') : null;
        if (detailId) {
            setCurrentExecutionId(detailId);
        }
    }, []);
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
        const res = await request({
            url: `${URL_PREFIX1}${URLS.GET_EXECUTION_DETAIL}${currentExecutionId}`,
        });
        const {code, data} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            setExecutionDetail(data);
            loopTimer.current = setTimeout(() => {
                setNeedLoopDetail(true);
            }, 5000);
        } else {
            clearTimeout(loopTimer.current);
            setExecuteDetailVisible(false);
            message.error('获取详情失败');
        }
    }, [currentExecutionId, loopTimer]);

    // 重新执行
    const reExecution = useCallback(async item => {
        const {id} = item;
        const res = await request({
            url: `${URL_PREFIX1}${URLS.RE_EXECUTE}${id}`,
            method: REQUEST_METHODS.POST,
        });
        const {code} = res;
        if (code === REQUEST_CODE.SUCCESS) {
            message.success('操作成功');
        }
    }, []);
    // Initialize 初始化
    useEffect(() => {
        getList();
    }, [searchValue]);

    useEffect(() => {
        if (currentExecutionId) {
            setExecuteDetailVisible(true);
        }

    }, [currentExecutionId]);

    useEffect(() => {
        getDetailId();
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
        executionDetail,
        reExecution,
        submitCallback: getDetailInfo,
        setCurrentExecutionId,
    };
};

export default useExecList;
