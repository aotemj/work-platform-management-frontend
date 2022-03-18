import cx from './index.less';

const ExecLog = () => {
    return (
        <div className={cx('step-log')}>
            <div className={cx('head')}>

            </div>
            <div className={cx('bottom')}>
                <div className={cx('side-bar')}></div>
                <div className={cx('log')}></div>
            </div>
        </div>
    );
};

export default ExecLog;
