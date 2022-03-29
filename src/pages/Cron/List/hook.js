import {useEffect, useState} from 'react';
import {message} from 'antd';
import {debounce} from '../../../utils';
import {reject, anyPass, isEmpty, isNil} from 'ramda';
import {request} from '../../../request/fetch';
import {EXEC_LIST_URL} from '../../../utils/api';
import {DEFAULT_PAGINATION} from '../../../constant';

const useCronList = () => {
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

    // 表格请求参数
    const getList = async () => {
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
    };

    // 更新currentPage、pageSize
    const handlePaginationChange = debounce((currentPage = 1, pageSize = 10) => {
            setSearchValue(value => ({
                ...value,
                currentPage,
                pageSize,
            }));
        }, 500);

    // 输入关键字筛选 userName
    const handleChangeInput = debounce(e => {
        setSearchValue(value => ({
            ...value,
            userName: e,
        }));
    }, 500);

    // 日期变化 beginTime endTime
    const handleChangeDate = debounce(({beginTime, endTime}) => {
        setSearchValue(value => ({
            ...value,
            beginTime,
            endTime,
        }));
    }, 500);

    // Initialize 初始化
    useEffect(() => {
        getList();
    }, [searchValue]);

    return {
        data,
        loading,
        handleChangeInput,
        handleChangeDate,
        handlePaginationChange,
    };
};

export default useCronList;
