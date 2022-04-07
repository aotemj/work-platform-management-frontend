import {message} from '@osui/ui';

import {getCompanyId, getSpaceId} from './getRouteIds';
import {
    CONTAINER_DOM_ID,
    DEFAULT_STRING_VALUE,
    HOUR_STEP,
    MAGE_BYTE_SCALE,
    MILLI_SECOND_STEP,
    MINUTE_STEP,
    PROJECT_ROUTE,
    PUBLIC_PATH,
    REQUEST_CODE,
} from '../constant';

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
/**
 * @param dateTimeStamp
 * @returns {{hourTime: number, secondTime: number, minuteTime: number, dayTime: number}}
 */
export const getDateTime = dateTimeStamp => {

    const parseIntForDecimal = str => parseInt(str, 10);
    // 获取总秒数
    let secondTime = parseIntForDecimal(dateTimeStamp / MILLI_SECOND_STEP);
    let dayTime = 0; // 天
    let minuteTime = 0; // 分
    let hourTime = 0; // 小时

    // 如果秒数大于60，将秒数转换成整数
    if (secondTime >= MINUTE_STEP) {
        // 获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseIntForDecimal(secondTime / MINUTE_STEP);
        // 获取秒数，秒数取佘，得到整数秒数
        secondTime = parseIntForDecimal(secondTime % MINUTE_STEP);
        // 如果分钟大于60，将分钟转换成小时
        if (minuteTime >= MINUTE_STEP) {
            // 获取小时，获取分钟除以60，得到整数小时
            hourTime = parseIntForDecimal(minuteTime / MINUTE_STEP);
            // 获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseIntForDecimal(minuteTime % MINUTE_STEP);
        }
        if (hourTime >= HOUR_STEP) {
            dayTime = parseIntForDecimal(hourTime / HOUR_STEP);
            hourTime = parseIntForDecimal(hourTime % HOUR_STEP);
        }
    }
    return {
        dayTime,
        hourTime,
        minuteTime,
        secondTime,
    };
};

export function debounce(fn, delay = MILLI_SECOND_STEP) {
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
    const PREFIX = projectId ? `${PUBLIC_PATH}${companyId}/${projectId}` : `${PUBLIC_PATH}${companyId}`;
    return `${PREFIX}/${PROJECT_ROUTE}`;
}

/**
 * 转换为 MB
 * @param fileSize 单位 byte
 */
export function convertFileSize(fileSize) {
    let size = 0;
    let symbol = 'byte';
    const doubleUnit = Math.pow(MAGE_BYTE_SCALE, 2);
    const treblingUnit = Math.pow(MAGE_BYTE_SCALE, 3);
    if (fileSize < doubleUnit) {
        size = fileSize / MAGE_BYTE_SCALE;
        symbol = 'Kb';
    } else if (fileSize <= treblingUnit) {
        size = fileSize / doubleUnit;
        symbol = 'Mb';
    } else {
        size = fileSize / treblingUnit;
        symbol = 'Gb';
    }
    return `${size.toFixed(2)}${symbol}`;
}

// 换算总耗时
export function convertConsumeTime(executionDetail, needDefaultDate = true) {
    if (!executionDetail) {
        return;
    }
    let {consumeTime = null, beginTime} = executionDetail;
    if (needDefaultDate) {
        if (!consumeTime && beginTime) {
            consumeTime = (Date.now() - beginTime) / MILLI_SECOND_STEP;
        }
    } else if (!consumeTime) {
        return DEFAULT_STRING_VALUE;
    }

    const {
        dayTime,
        hourTime,
        minuteTime,
        secondTime,
    } = getDateTime(consumeTime * MILLI_SECOND_STEP);
    const dateStr = dayTime ? `${dayTime}d` : '';
    const hourStr = hourTime ? `${hourTime}h` : '';
    const minuteStr = minuteTime ? `${minuteTime}m` : '';
    const secondStr = secondTime ? `${secondTime}s` : '';
    return `${dateStr}${hourStr}${minuteStr}${secondStr}`;
}

export function requestCallback({
    res,
    hideMessage = false,
    successMessage = '操作成功',
    callback,
    errorCallback,
}) {
    const {code, msg, data} = res;
    if (code === REQUEST_CODE.SUCCESS) {
        if (!hideMessage) {
            message.success(successMessage || msg);
        }
        callback && callback(data);
    } else {
        errorCallback && errorCallback(data);
    }
}






















