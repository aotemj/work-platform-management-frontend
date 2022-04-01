import React from 'react';
import cx from '../index.less';
import {Input} from '@osui/ui';
import DateRangePicker from '../../../../components/DateRangePicker';
import {ReactComponent as IconSearch} from '../../../../statics/icons/search.svg';

const OperationBar = ({handleChangeInput, handleChangeDate}) => {

    return (
        <div className={cx('operation-bar')}>
            <div className={cx('left')}>
                {/* 发起人查询 */}
                <Input
                    placeholder={'请输入发起人'}
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
        </div>
    );
};

export default OperationBar;
