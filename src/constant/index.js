import React from 'react';

import cx from '../components/FormField/index.less';
import {getCompanyId} from '../utils/getRouteIds';
import {ReactComponent as IconSuccess} from '../components/FormField/icons/success.svg';
import {ReactComponent as IconError} from '../components/FormField/icons/error.svg';
import {ReactComponent as IconInfo} from '../statics/icons/info.svg';
import {ReactComponent as IconWarning} from '../components/FormField/icons/warning.svg';

export const IS_PROD = process.env.NODE_ENV === 'production';

export const PROJECT_ROUTE = '_noah';

export const PUBLIC_PATH = '/';

// common pagination
export const DEFAULT_PAGINATION = {
    list: [],
    pageSize: 10,
    current: 1,
    total: 0,
    pageSizeOptions: [10, 20, 30, 50],
    showSizeChanger: true,
    showQuickJumper: true,
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

export const COMMON_URL_PREFIX = IS_PROD ? '/api/noah' : '/api';

export const GLOBAL_URL_PREFIX = IS_PROD ? '/noah' : '/global';

export const REQUEST_CODE = {
    SUCCESS: 200,
};

export const GLOBAL_URLS = {
    GET_USERS: `/user/${getCompanyId()}/rest/v1/companies/${getCompanyId()}/users`,
    GET_SCRIPTS: '/script/rest/v1/script-tasks',
    LABELS: '/resource/sa/rest/v3/labels',
    AGENTS: '/resource/sa/rest/v1/agents',
    CURRENT_USER: `/user/${getCompanyId()}/rest/v1/companies/${getCompanyId()}/users/current/center`,
};

export const SPLIT_SYMBOL = ',';

export const MAX_DISPLAY_LENGTH = 3;

// 服务端删除标识
export const DELETE_SYMBOL = -1;

// 作业步骤类型
export const STEP_TYPES = {
    EXECUTE_SCRIPT: {
        label: '执行脚本',
        value: 1,
    },
    FILE_DISTRIBUTION: {
        label: '文件分发',
        value: 2,
    },
    MANUAL_CONFIRM: {
        label: '人工确认',
        value: 3,
    },
};

export const MILLI_SECOND_STEP = 1000;
export const HOUR_STEP = 24;
export const MINUTE_STEP = 60;
export const MAGE_BYTE_SCALE = 1024;

export const LOG_CONTENT_SEPARATOR = '\n';

export const PROMISE_STATUS = {
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
    PENDING: 'pending',
};

export const TYPES_OF_FETCHING = {
    INIT: 'init',
    MORE: 'more',
};

export const PAGE_SIZE_OF_NO_PAGINATION = 100000;

export const MESSAGE_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
};

export const REQUEST_URL_TYPES = {
    INTERNAL: {
        label: 'INTERNAL',
        value: 'COMMON',
        prefix: COMMON_URL_PREFIX,
    },
    EXTERNAL: {
        label: 'EXTERNAL',
        value: 'GLOBAL',
        prefix: GLOBAL_URL_PREFIX,
    },
};

export const DEFAULT_SUCCESS_MESSAGE = '操作成功';
