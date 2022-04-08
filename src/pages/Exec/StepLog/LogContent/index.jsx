/**
 * 日志
 * @returns {string}
 * @constructor
 */

import {useCallback, useEffect, useMemo, useState} from 'react';
import {Collapse} from '@osui/ui';

import SingleLineLog from './SingleLineLog';
import {LOG_CONTENT_SEPARATOR, PROMISE_STATUS} from '../../../../constant';
import cx from './index.less';
import {transformLogUrl} from '../constant';


const {Panel} = Collapse;

const LogContent = ({dataSource = [], errorInfo: originErrorInfo, updateLoading}) => {
    const [activeId, setActiveId] = useState(null);
    const [logList, setLogList] = useState([]);
    const handleChangeActiveId = useCallback(item => {
        setActiveId(item.key);
    }, []);
    const currentData = useMemo(() => {
        return dataSource.filter(item => item.key === activeId)[0];
    }, [activeId, dataSource]);

    const getLogContent = useCallback(async () => {
        setLogList([]);
        if (!currentData) {
            return;
        }

        const {logShowList} = currentData;
        if (!logShowList || !logShowList.length) {
            return;
        }

        updateLoading(true);
        const resList  = await Promise.allSettled(logShowList.map(async logItem => {
            const {logUrl} = logItem;
            const res = await fetch(transformLogUrl(logUrl));
            return {
                ...logItem,
                content: await res.text(),
            };
        }));
        setLogList(resList.filter(item => item.status === PROMISE_STATUS.FULFILLED) || []);
        updateLoading(false);
    }, [currentData]);

    useEffect(() => {
        if (dataSource.length) {
            setActiveId(dataSource[0]?.key);
        }
    }, [dataSource]);

    useEffect(() => {
        getLogContent();
    }, [activeId]);

    const LogItem = ({logContent = ''}) => {
        return logContent.split(LOG_CONTENT_SEPARATOR)
            .map(item => <SingleLineLog content={item} key={item} />);
    };

    const hasMultiLogs = logList.length > 1;
    const onlyOneLog = logList.length === 1;

    const firstLog = logList[0];
    return (
        <div className={cx('log-container')}>
            {
                dataSource.length && (
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
                )
            }
            <div className={cx('content')}>

                {/* 人力紧张 日志简单化处理，后期有需求再迭代 */}

                {
                    hasMultiLogs && logList.map(item => {
                        const {
                            value: {
                                content,
                                filePath,
                            },
                        } = item;
                        return (
                            <Collapse className={cx('log-collapse')} key={filePath}>
                                <Panel header={filePath} className={cx('log-panel')}>
                                    <LogItem logContent={content} />
                                </Panel>
                            </Collapse>
                        );
                    })
                }
                {
                    onlyOneLog && (<LogItem logContent={firstLog.value.content} />)
                }
                {
                    !hasMultiLogs && !onlyOneLog && <LogItem logContent={originErrorInfo} />
                }
            </div>
        </div>
    );
};

export default LogContent;
