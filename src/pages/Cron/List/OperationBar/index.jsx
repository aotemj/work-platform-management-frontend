import React from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Input, Button} from '@osui/ui';

import cx from '../index.less';
import {ReactComponent as IconSearch} from '../../../../statics/icons/search.svg';

const OperationBar = ({handleChangeInput, handleAddCron}) => (
    <div className={cx('operation-bar')}>
        <div className={cx('left')}>
            {/* 发起人查询 */}
            <Input
                placeholder={'请输入更新人'}
                className={cx('search')}
                suffix={<IconSearch />}
                onChange={e => handleChangeInput(e.target.value)}
                maxLength={50}
                allowClear
            />
        </div>
        <div className={cx('right')}>
            <Button
                type="primary"
                onClick={handleAddCron}
                icon={<PlusOutlined />}
                className={cx('create-button')}
            >新建任务
            </Button>
        </div>
    </div>
);

export default OperationBar;
