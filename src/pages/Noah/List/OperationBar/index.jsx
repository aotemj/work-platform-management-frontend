import {Button, Dropdown, Input, Menu, Select} from '@osui/ui';
import {useDispatch, useSelector} from 'react-redux';

import cx from '../index.less';
import {DROP_DOWN_MENU} from '../constants';
import {ReactComponent as IconSearch} from '../../../../statics/icons/search.svg';
import {debounceWith250ms, generateDispatchCallback, loadMoreCallBackByScrolling} from '../../../../utils';
import {getCategoryList} from '../../../../reduxSlice/category/categorySlice';

const OperationBar = ({
    handleChange,
    handleMenuClick,
    handleChangeInput,
    noahType,
    addNoah,
    setNoahType,
    onCategorySearchCallback,
    categorySearchName,
}) => {
    const dispatch = useDispatch();
    const {list, currentPage: categoryCurrentPage, loading} = useSelector(state => state.category);
    const updateCategoryList = generateDispatchCallback(dispatch, getCategoryList);
    const typeSelectProps = {
        options: list.map(project => {
            const {name, id} = project;
            return {label: name, value: id, key: id};
        }),
        loading,
        getPopupContainer: triggerNode => triggerNode.parentNode,
        className: cx('noah-list-select'),
        placeholder: '搜索作业类型',
        showSearch: true,
        filterOption: false,
        onSearch: onCategorySearchCallback,
        allowClear: true,
        onClear: () => {
            setNoahType(null);
        },
        onPopupScroll: debounceWith250ms(e => {
            loadMoreCallBackByScrolling(e, {
                dispatch: updateCategoryList,
                currentPage: categoryCurrentPage,
                params: {
                    name: categorySearchName,
                },
            });
        }),
        onSelect: handleChange,
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
                <Button
                    type="primary"
                    className={cx('create-button')}
                    onClick={addNoah}
                >新建
                </Button>
                <Dropdown
                    overlay={menu}
                    placement={'bottom'}
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
