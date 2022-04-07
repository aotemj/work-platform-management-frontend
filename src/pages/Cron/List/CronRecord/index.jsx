// 执行记录
import {Drawer, Table, Spin} from '@osui/ui';
import {useEffect, useState} from 'react';

import DateRangePicker from '../../../../components/DateRangePicker';
import {COMMON_URL_PREFIX, DEFAULT_STRING_VALUE} from '../../../../constant';
import {request} from '../../../../request/fetch';
import {URLS} from '../../constant';
import {formatTimeStamp, requestCallback} from '../../../../utils';
import StatusTag from '../../../../components/StatusTag';
import cx from './index.less';
import {RUN_STATUSES} from '../../../Exec/List/constant';

const CronRecord = ({handleChangeDate, visible, recordId, onClose}) => {

    const [dataSource, setDataSource] = useState([]);
    const getCronRecord = async () => {
        const res = await request({
            url: `${COMMON_URL_PREFIX}${URLS.CRON_RECORD}${recordId}`,
        });
        requestCallback({
            res,
            hideMessage: true,
            callback(data) {
                const {list, total} = data;
                setDataSource(list);
            },
        });
    };
    useEffect(() => {
        if (recordId) {
            getCronRecord();
        }
    }, [recordId]);
    const title = '执行记录';

    const recordProps = {
        columns: [
            {
                title: 'ID',
                dataIndex: 'id',
            },
            {
                title: '任务状态',
                dataIndex: 'runStatus',
                align: 'center',
                render(status) {
                    return (
                        <div className={cx('run-status')}>
                            {RUN_STATUSES.get(status).icon}
                            <StatusTag status={status} />
                        </div>
                    );
                },
            },
            {
                title: '开始时间',
                dataIndex: 'beginTime',
                render(val) {
                    return formatTimeStamp(val);
                },
            },
            {
                title: '耗时',
                dataIndex: 'consumeTime',
                render(val) {
                    return val || DEFAULT_STRING_VALUE;
                },
            },
        ],
        dataSource,
    };
    const drawerProps = {
        width: 720,
        title,
        visible,
        onClose,
    };
    return (
        <Drawer {...drawerProps}>
            {/* 时间段选择做多31天 */}
            {/* <DateRangePicker */}
            {/*     handleChangeDate={handleChangeDate} */}
            {/* /> */}
            <Spin spinning={false}>
                {visible && <Table {...recordProps} />}
            </Spin>
        </Drawer>
    );
};

export default CronRecord;
