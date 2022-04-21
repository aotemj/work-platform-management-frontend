import cx from '../index.less';

const TimeItem = ({item}) => {
    return (
        <span className={cx('exec-step-card-grid')}>
            <span className={cx('exec-step-card-key')}>{item?.label}</span>
            <span className={cx('exec-step-card-value')}>{item?.value}</span>
        </span>
    );
};

export default TimeItem;
