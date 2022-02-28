import {useCallback, useState} from 'react';

import {URL, URL_PREFIX1} from '../constants';
import {request} from '../../../../request/fetch';
import {debounce} from '../../../../utils';
import {REQUEST_METHODS} from '../../../../constant';
import {message} from '@osui/ui';

const useCategory = () => {
    const [categories, setCategories] = useState([]);

    const handleSubmitAddCategory = useCallback(debounce(async ({name}) => {
        const res = await request({
            url: `${URL_PREFIX1}${URL.ADD_CATEGORIES}`,
            method: REQUEST_METHODS.POST,
            params: {
                // createTime	创建时间		false
                // id	ID		false
                // name	名称		false
                // status	通用状态 0：正常；-1：删除；		false
                // tenant	租户信息		false
                // updateTime	修改时间		false
                // userId	创建人
                name,
                // 'status': 0,
                'tenant': '',
                // 'updateTime': '',
                // 'userId': 0,
            },
        });
        const {status, msg} = res;
        if (!status) {
            message.success('添加成功');
        } else {
            message.error(msg);
        }
    }, 500), []);

    const fetchCategory = useCallback(async () => {
        const res = await request({
            url: `${URL_PREFIX1}${URL.CATEGORIES}`,
            params: {
                // currentPage	当前页	query	false   integer(int32)
                // name	名称，模糊查询	query	false   string
                // pageSize	每页数据条数	query	false   integer(int32)

                currentPage: 1,
                name: '',
                pageSize: 100000,
            },
        });
        const {data, status} = res;
        if (!status) {
            setCategories(data.list);
        }
    }, []);

    return {
        categories,
        fetchCategory,
        handleSubmitAddCategory,
    };
};

export default useCategory;

