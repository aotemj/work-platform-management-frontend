import {useCallback, useState} from 'react';
import {message} from '@osui/ui';

import {URL, URL_PREFIX1} from '../constants';
import {request} from '../../../../request/fetch';

const useCategory = addCallback => {
    const [categories, setCategories] = useState([]);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);

    // 新增分类不进行入库操作，只在前端做暂存
    const handleSubmitAddCategory = useCallback(async ({name}) => {
        const id = Date.now();
        setCategories([{name, id}, ...categories]);
        message.success('添加成功');
        addCallback({name, id});
    }, [categories, addCallback]);

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
        addCategoryVisible,
        setAddCategoryVisible,
    };
};

export default useCategory;

