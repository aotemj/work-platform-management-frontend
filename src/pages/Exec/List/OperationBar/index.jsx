import cx from '../index.less';
import {Input} from '@osui/ui';
import {ReactComponent as IconSearch} from '../../../../statics/icons/search.svg';
import React from 'react';

const OperationBar = ({handleChange, noahTypes = [], handleMenuClick, handleChangeInput, noahType, addNoah}) => {

    return (
        <div className={cx('operation-bar')}>
            <div className={cx('left')}>
                {/* 发起人查询 */}
                <Input
                    placeholder={'请输入发起人名'}
                    className={cx('search')}
                    suffix={<IconSearch />}
                    onChange={e => handleChangeInput(e.target.value)}
                    maxLength={50}
                    allowClear
                />
            </div>
        </div>
    );
};

export default OperationBar;
