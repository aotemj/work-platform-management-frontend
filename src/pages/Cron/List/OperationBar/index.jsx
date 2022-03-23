import React from 'react';
import cx from '../index.less';
import {Input, Button} from '@osui/ui';
import DateRangePicker from '../../../../components/DateRangePicker';
import {ReactComponent as IconSearch} from '../../../../statics/icons/search.svg';
import {PlusOutlined} from '@ant-design/icons';

const OperationBar = ({handleChangeInput, handleChangeDate}) => {

    return (
        <div className={cx('operation-bar')}>
            <div className={cx('left')}>
                {/* 发起人查询 */}
                <Input
                    placeholder={'请输入搜索关键字'}
                    className={cx('search')}
                    suffix={<IconSearch />}
                    onChange={e => handleChangeInput(e.target.value)}
                    maxLength={50}
                    allowClear
                />
                {/* 时间段选择做多31天 */}
                <DateRangePicker
                    handleChangeDate={handleChangeDate}
                />
            </div>
            <div className={cx('right')}>
                <Button type="primary" icon={<PlusOutlined />} className={cx('create-button')}>新建任务</Button>
            </div>
        </div>
    );
};

export default OperationBar;