import cx from './index.less';

const HeaderDetailItem = ({item}) => {
    return (
        <span className={cx('desc-item')}>
            <span className={cx('title')}>{item?.label}</span>
            <span className={cx('value')}>{item?.value}</span>
        </span>
    );
};
export default HeaderDetailItem;
