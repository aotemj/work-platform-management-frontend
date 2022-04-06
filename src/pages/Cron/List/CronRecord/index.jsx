// 执行记录
import {Drawer, Table} from '@osui/ui';
import {useEffect, useState} from 'react';

import DateRangePicker from '../../../../components/DateRangePicker';
import {COMMON_URL_PREFIX} from '../../../../constant';
import {request} from '../../../../request/fetch';
import {URLS} from '../../constant';
import {requestCallback} from '../../../../utils';

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
                tile: 'ID',
                dataIndex: 'id',
            },
            {
                tile: '任务状态',
                dataIndex: 'status',
            },
            {
                tile: '开始时间',
                dataIndex: 'beginTime',
            },
            {
                tile: '耗时',
                dataIndex: 'consumeTime',
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
            {visible && <Table {...recordProps} />}
        </Drawer>
    );
};

export default CronRecord;
