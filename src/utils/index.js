import {ROUTE_PREFIX} from './constant';
import {getCompanyId, getSpaceId} from './getRouteIds';
import {CONTAINER_DOM_ID, DEFAULT_STRING_VALUE, PROJECT_ROUTE} from '../constant';

const formatWidthEero = (origin, maxLength, fillString) => {
    return String(origin).padStart(maxLength, fillString);
};

const formatTime = origin => {
    return formatWidthEero(origin, 2, '0');
};
export const formatTimeStamp = (timestamp, dateSymbol = '-', timeSymbol = ':') => {
    if (!timestamp) {
        return DEFAULT_STRING_VALUE;
    }
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = formatTime(date.getMonth() + 1);
    const day = formatTime(date.getDate());
    const hour = formatTime(date.getHours());
    const minute = formatTime(date.getMinutes());
    const second = formatTime(date.getSeconds());
    return `${year}${dateSymbol}${month}${dateSymbol}${day} ${hour}${timeSymbol}${minute}${timeSymbol}${second}`;
};

export const getRealUrlPrefix = () => {
    return ROUTE_PREFIX.replace(':companyId', getCompanyId());
};

export function debounce(fn, delay = 1000) {
    let timer = null;
    return function (...rest) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, rest);
            timer = null;
        }, delay);
    };
}

export function getContainerDOM() {
    return document.getElementById(CONTAINER_DOM_ID);
}

export function getURlWithPrefix(prefix, url) {
    return `${prefix}${url}`;
}

export function getUrlPrefixReal() {
    const companyId = getCompanyId();
    const projectId = getSpaceId();
    return projectId ? `/${companyId}/${projectId}/${PROJECT_ROUTE}` : `/${companyId}/${PROJECT_ROUTE}`;
}

/**
 * 转换为 MB
 * @param fileSize 单位 byte
 */
export function convertFileSize(fileSize) {
    const Symbol = 1024;
    let size = 0;
    let symbol = 'byte';
    if (fileSize < Math.pow(Symbol, 2)) {
        size = fileSize / Symbol;
        symbol = 'Kb';
    } else if (fileSize <= Math.pow(Symbol, 3)) {
        size = fileSize / Math.pow(Symbol, 2);
        symbol = 'Mb';
    } else {
        size = fileSize / Math.pow(Symbol, 3);
        symbol = 'Gb';
    }
    return `${size.toFixed(2)}${symbol}`;
}
