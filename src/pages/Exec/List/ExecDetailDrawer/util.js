// 全部主机重试
import {message} from '@osui/ui';

import {request} from '../../../../request/fetch';
import {REQUEST_CODE, REQUEST_METHODS, COMMON_URL_PREFIX} from '../../../../constant';
import {URLS} from '../constant';

// 全部主机 重试
export const entirelyRetry = async ({id}) => {
    const res = await request({
        url: `${COMMON_URL_PREFIX}${URLS.ENTIRELY_RE_EXECUTE}${id}`,
        method: REQUEST_METHODS.POST,
    });
    const {code} = res;
    if (code === REQUEST_CODE.SUCCESS) {
        message.success('操作成功');
    }
};

// 忽略错误
export const neglectErrors = async ({id}) => {
    const res = await request({
        url: `${COMMON_URL_PREFIX}${URLS.NEGLECT_ERRORS}${id}`,
        method: REQUEST_METHODS.POST,
    });
    const {code} = res;
    if (code === REQUEST_CODE.SUCCESS) {
        message.success('操作成功');
    }
};

