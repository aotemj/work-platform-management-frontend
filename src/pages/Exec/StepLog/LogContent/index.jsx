/**
 * 日志
 * @returns {string}
 * @constructor
 */

import cx from './index.less';
import {useCallback, useEffect, useMemo, useState} from 'react';
import SingleLineLog from './SingleLineLog';

const LogContent = ({dataSource = []}) => {
    const [activeId, setActiveId] = useState(null);
    const [logList, setLogList] = useState([]);
    const handleChangeActiveId = useCallback(item => {
        setActiveId(item.key);
    }, []);

    const currentData = useMemo(() => {
        return dataSource.filter(item => item.key === activeId)[0];
    }, [activeId, dataSource]);

    const getLogContent = useCallback(async () => {
        if (!currentData) {
            return;
        }

        const {logUrl} = currentData;
        if (!logUrl) {
            return;
        }
        const res = await fetch(logUrl);
        const content = await res.text();
        const logList = content.split('\n');
        setLogList(logList);
    }, [currentData]);

    useEffect(() => {
        if (dataSource.length) {
            setActiveId(dataSource[0]?.key);
        }
    }, [dataSource]);

    useEffect(() => {
        getLogContent();
    }, [activeId]);

    return (
        <div className={cx('log-container')}>
            <div className={cx('header')}>
                {
                    dataSource.map(item => {
                        return (
                            <div
                                onClick={() => handleChangeActiveId(item)}
                                className={cx('log-item-title', activeId === item.key ? 'active' : null)}
                                key={item.key}
                            >
                                {item.IP}
                            </div>
                        );
                    })
                }
            </div>
            <div className={cx('content')}>
                {/* 人力紧张 日志简单化处理，后期有需求再迭代 */}
                {
                    logList.map(item => {
                        return <SingleLineLog key={item} content={item} />;
                    })
                }
            </div>
        </div>
    );
};

export default LogContent;
