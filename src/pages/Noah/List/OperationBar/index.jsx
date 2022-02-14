import cx from '../index.less';
import {Button, Dropdown, Input, Menu, Select} from '@osui/ui';
import {DROP_DOWN_MENU} from '../constants';
import {ReactComponent as IconSearch} from '../../../../statics/icons/search.svg';
import React from 'react';

const OperationBar = ({handleChange, noahTypes = [], handleMenuClick, handleChangeInput, noahType}) => {

    const typeSelectProps = {
        options: noahTypes.map(project => {
            const {name, id, tags} = project;
            return {label: name, value: id, key: id, tags};
        }),
        getPopupContainer: triggerNode => triggerNode.parentNode,
        className: cx('noah-list-select'),
        placeholder: '搜索作业类型',
        showSearch: true,
        allowClear: true,
        // optionFilterProp: isFilterFromTags ? 'tags' : 'label',
        // optionFilterProp: 'label',
        // mode: 'multiple',
        onChange: handleChange,
        value: noahType,
    };
    const menu = (
        <Menu onClick={handleMenuClick}>
            {
                Object.values(DROP_DOWN_MENU).map(item => {
                    return <Menu.Item key={item.key}>{item.label}</Menu.Item>;
                })
            }
        </Menu>
    );

    return (
        <div className={cx('operation-bar')}>
            <div className={cx('left')}>
                {/* 方案名查询 */}
                <Input
                    placeholder={'请输入方案名'}
                    className={cx('search')}
                    suffix={<IconSearch />}
                    onChange={e => handleChangeInput(e.target.value)}
                    maxLength={50}
                    allowClear
                />
                {/* 类型筛选 */}
                <Select {...typeSelectProps} />
            </div>
            <div className={cx('right')}>
                <Button type="primary" className={cx('create-button')}>新建</Button>
                <Dropdown
                    overlay={menu}
                    placement={'bottomCenter'}
                    overlayClassName={'noah-dropdown-menu'}
                    trigger={'click'}
                >
                    <Button type="primary">批量操作</Button>
                </Dropdown>
            </div>
        </div>
    );
};

export default OperationBar;
