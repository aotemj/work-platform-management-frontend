import {PUBLIC_PATH} from '../constant';

const XLY_PREFIX_REGEXP = /^\/([^/]*)/;

export const getCompanyId = () => {
    const matches = window.location.pathname.replace(PUBLIC_PATH, '/').match(XLY_PREFIX_REGEXP);
    return matches ? matches[1] : '';
};

export const getSpaceId = () => {
    const pathname = window.location.pathname
        .replace(PUBLIC_PATH, '/')
        .replace(/^\//, '').split('/');
    return pathname && pathname.length > 1 && !pathname[1].startsWith('_') ? pathname[1] : '';
};
