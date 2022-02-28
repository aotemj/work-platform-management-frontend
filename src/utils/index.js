import {ROUTE_PREFIX} from './constant';
import {getCompanyId, getSpaceId} from './getRouteIds';
import {CONTAINER_DOM_ID, PROJECT_ROUTE} from '../constant';

const formatWidthEero = (origin, maxLength, fillString) => {
    return String(origin).padStart(maxLength, fillString);
};

const formatTime = origin => {
    return formatWidthEero(origin, 2, '0');
};
export const formatTimeStamp = (timestamp, dateSymbol = '-', timeSymbol = ':') => {
    if (!timestamp) {
        return '--';
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
};
