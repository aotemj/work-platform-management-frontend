import {useNavigate} from 'react-router-dom';
import {useCallback, useEffect, useMemo, useRef} from 'react';
import {PageHeader, Button} from '@osui/ui';
import fileDownload from 'js-file-download';
import {prop} from 'ramda';

import cx from '../index.less';
import HeaderDetailItem from '../../components/HeaderDetailItem';
import {convertConsumeTime, formatTimeStamp, Toast} from '../../../../utils';
import {FAILED, RUN_STATUSES} from '../../List/constant';
import {entirelyRetry, neglectErrors} from '../../List/ExecDetailDrawer/util';
import {
    LOG_CONTENT_SEPARATOR,
    MILLI_SECOND_STEP,
    PROMISE_STATUS,
} from '../../../../constant';
import {transformLogUrl} from '../constant';

const Header = ({executionDetail, params, dataSource, setAddStepDrawerVisible}) => {
    const navigate = useNavigate();
    const downloadTimer = useRef();
    // 只要有可用的下载日志url, 就可以允许下载
    const downloadButtonDisable = useMemo(() => {
        const length = dataSource.length;
        let res = true;
        for (let i = 0; i < length; i++) {
            const {logShowList} = dataSource[i];
            const logLength = logShowList.length;

            if (!res) {
                break;
            }
            for (let j = 0; j < logLength; j++) {
                const {logUrl} = logShowList[j];
                if (logUrl) {
                    res = false;
                    break;
                }
            }
        }
        return res;
    }, [dataSource]);

    // 下载日志
    const downloadLog = async () => {
        const promises = dataSource.map(item => {
            const {logShowList, IP} = item;
            if (!logShowList) {
                return false;
            }
            return Promise.allSettled(logShowList.map(async logItem => {
                const {logUrl} = logItem;
                return fetch(transformLogUrl(logUrl)).then(
                    async res => {
                        const content = await res.text();
                        return {
                            content,
                            IP,
                        };
                    },
                );
            })).then(res => {
                let contentList  = [];
                let {IP} = res[0].value;
                let length = res.length;
                for (let i = 0; i < length; i++) {
                    const {status, value: {content}} = res[i];
                    if (status === PROMISE_STATUS.FULFILLED) {
                        contentList.push(content);
                    }
                }
                fileDownload(contentList.join(LOG_CONTENT_SEPARATOR), `${IP}.log`);
                return res;
            });
        }).filter(Boolean);
        const res = await Promise.allSettled(promises);
        const failedCount = res.filter(item => item.status !== PROMISE_STATUS.FULFILLED).length;
        const length = res.length;

        downloadTimer.current = setTimeout(() => {
            if (failedCount < length) {
                Toast.success(`当前日志下载完成，成功${length - failedCount}个，失败${failedCount}个`);
            } else if (failedCount === length) {
                Toast.error('当前日志下载失败');
            }
        }, [MILLI_SECOND_STEP]);

    };

    const stepDetail = useMemo(() => {
        return executionDetail?.stageTriggerList?.filter(item => item.id === Number(params?.stepId))[0];
    }, [executionDetail?.stageTriggerList, params?.stepId]);

    const runStatus = useMemo(() => {
        //    runStatus	执行状态 1：待执行；2：执行中；3：执行失败；4：执行成功；5：执行暂停；
        return (
            <span className={cx('execute-status', `status-${stepDetail?.runStatus}`)}>
                {RUN_STATUSES.get(stepDetail?.runStatus)?.label}
            </span>
        );

    }, [stepDetail?.runStatus]);
    const errorOperations = [
        {
            label: '全部主机重试',
            execution: () => entirelyRetry({id: params?.stepId}, navigate),
        },
        {
            label: '忽略错误',
            execution: () => neglectErrors(stepDetail, navigate),
        },
    ];

    const operations = [
        {
            label: '下载日志', // 下载日志，下载所有的IP执行日志，是压缩文件，一个ip一个txt文档 (from product manager)
            execution: downloadLog,
            disabled: downloadButtonDisable,
        },
        {
            label: '查看步骤内容',
            execution: () => setAddStepDrawerVisible(true),
            type: 'primary',
        },
    ];

    if (stepDetail?.runStatus === FAILED.value) {
        operations.unshift(...errorOperations);
    }

    const userName = prop('userName', executionDetail);

    const title = prop('name', stepDetail);

    const beginTime = useMemo(() => {
        const beginTime = stepDetail?.beginTime;
        return formatTimeStamp(beginTime);
    }, [stepDetail?.beginTime]);

    const headerDetail = [
        {
            label: '发起人：',
            value: userName,
        },
        {
            label: '发起时间：',
            value: beginTime,
        },
        {
            label: '状态：',
            value: runStatus,
        },
        {
            label: '总耗时：',
            value: convertConsumeTime(stepDetail),
        },
    ];

    const goBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    useEffect(() => {
        return () => {
            clearTimeout(downloadTimer.current);
        };
    }, []);

    return (
        <PageHeader
            onBack={goBack}
            title={title}
            className={cx('fundamental-info')}
            extra={operations.map(operation => (
                <Button
                    disabled={operation.disabled}
                    key={operation.label}
                    type={operation.type || 'default'}
                    onClick={() => operation.execution(executionDetail)}
                >{operation.label}
                </Button>
            ))}
        >
            <div className={cx('desc-container')}>
                {headerDetail.map(item => (<HeaderDetailItem key={item?.label} item={item} />))}
            </div>
        </PageHeader>
    );
};

export default Header;
