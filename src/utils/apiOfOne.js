/**
 *  获取所有的项目
 * @returns 所有项目列表
 */
import {request} from '../request/fetch';
import {getCompanyId} from './getRouteIds';

const getProjectListUrl = ({_offset = 0, _limit = 100000}) => {
    const companyId = getCompanyId();
    // eslint-disable-next-line max-len
    return `/api/facade/${companyId}/rest/v2/companies/${companyId}/projects/v2`;
};
export const getAllProjectFromOne = async (name, _offset, _limit) => {
    try {
        const res = await request({
            method: 'post',
            params: {
                name: '',
            },
            url: getProjectListUrl({}),
        });
        const {status, data} = res;
        if (!status) {
            return data || [];
        }
        return [];
    } catch (e) {
        console.error(e);
    }
};
