/**
 *  任务状态Tag
 */
import React from 'react';
import cx from './index.less';


const statusText = ['未开始', '执行中', '失败', '成功'];
const statusColor = {
    '未开始': {
        color: '#0C62FF',
        bgColor: '#E2ECFF',
    },
    '执行中': {
        color: '#854800',
        bgColor: 'rgba(255, 139, 0, 0.3)',
    },
    '失败': {
        color: '#FF5630',
        bgColor: '#FFEBE5',
    },
    '成功': {
        color: '#E2FFEE',
        bgColor: '#00875A',
    },
    '其他': {
        color: 'red',
        bgColor: 'cyan',
    },
};

const StatusTag = ({status}) => {
    let keyText = statusText[status] ? statusText[status] : '其他';
    return (
        <span
            className={cx('noah-status-tag')}
            style={{color: statusColor[keyText].color, backgroundColor: statusColor[keyText].bgColor}}
        >
            {keyText}
        </span>
    );
};

export default StatusTag;
