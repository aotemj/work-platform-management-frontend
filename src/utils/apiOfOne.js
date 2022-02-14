/**
 *  获取所有的项目
 * @returns 所有项目列表
 */
import {getCompanyfix} from '../../../utils/getRouteIds';
import {requestForAgn} from './index';

const getProjectListUrl = ({name = '', _offset = 0, _limit = 100000}) => {
    const companyId = getCompanyfix();
    // eslint-disable-next-line max-len
    return `/api/facade/${companyId}/rest/v2/companies/${companyId}/projects/v2`;
};
export const getAllProjectFromOne = async (name, _offset, _limit) => {
    try {
        const res = await requestForAgn({
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
