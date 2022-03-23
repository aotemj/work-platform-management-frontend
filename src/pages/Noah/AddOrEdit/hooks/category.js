import {useCallback, useState} from 'react';
import {message} from '@osui/ui';

import {ERROR_MSG, URLS} from '../constants';
import {request} from '../../../../request/fetch';
import {COMMON_URL_PREFIX} from '../../../../constant';

const useCategory = addCallback => {
    const [categories, setCategories] = useState([]);
    const [categoryMap, setCategoryMap] = useState({});
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);

    // 新增分类不进行入库操作，只在前端做暂存
    const handleSubmitAddCategory = useCallback(({name}) => {
        if (categoryMap[name]) {
            message.error(ERROR_MSG.CATEGORY_ALREADY_EXIST);
            return false;
        }

        const id = Date.now();
        setCategories([{name, id}, ...categories]);
        message.success('添加成功');
        addCallback({name, id});
        return true;
    }, [categoryMap, categories, addCallback]);

    const updateCategoryMap = useCallback(list => {
        const length = list.length;
        const map = {};
        for (let i = 0; i < length; i++) {
            const {name = ''} = list[i];
            map[name] = list[i];
        }
        setCategoryMap(map);
    }, []);

    const fetchCategory = useCallback(async () => {
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.CATEGORIES}`,
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
            updateCategoryMap(data.list);
        }
    }, [updateCategoryMap]);

    return {
        categories,
        categoryMap,
        fetchCategory,
        handleSubmitAddCategory,
        addCategoryVisible,
        setAddCategoryVisible,
    };
};

export default useCategory;

