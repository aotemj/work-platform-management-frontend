import {ReactComponent as IconSuccess} from '../components/FormField/icons/success.svg';
import cx from '../components/FormField/index.less';
import {ReactComponent as IconError} from '../components/FormField/icons/error.svg';
import {ReactComponent as IconInfo} from '../statics/icons/info.svg';
import {ReactComponent as IconWarning} from '../components/FormField/icons/warning.svg';
import React from 'react';
import {getCompanyId} from '../utils/getRouteIds';

export const PROJECT_ROUTE = '_settings';

export const ROUTE_PREFIX = `/:companyId/${PROJECT_ROUTE}`;

// common pagination
export const DEFAULT_PAGINATION = {
    list: [],
    pageSize: 10,
    pageNum: 1,
    total: 0,
    pageSizeOptions: [10, 20, 30, 50],
};

export const CONTAINER_DOM_ID = 'osc-noah';

export const REQUEST_METHODS =  {
    GET: 'GET',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
};

export const REQUEST_TYPE = {
    FORM_DATA: 'formData',
    BLOB: 'blob',
    JSON: 'json',
};

export const SYMBOL_FOR_ALL = '*';

export const LevelIconMap = {
    success: <IconSuccess className={cx('error-message-icon')} />,
    error: <IconError className={cx('error-message-icon')} />,
    info: <IconInfo className={cx('error-message-icon')} />,
    warning: <IconWarning className={cx('error-message-icon')} />,
};

export const DEFAULT_STRING_VALUE = '--';

export const URL_PREFIX1 = '/api';

export const REQUEST_CODE = {
    SUCCESS: 200,
};

export const GLOBAL_URLS = {
    GET_USERS: (() =>
        `/facade/${getCompanyId()}/rest/v2/companies/${getCompanyId()}/users`)(),
};

export const SPLIT_SYMBOL = ',';

export const MAX_DISPLAY_LENGTH = 3;
