import cx from '../index.less';

const RetryButton = ({fileKey, handleReUploadLocalFile}) => {
    return (
        <span
            onClick={() => handleReUploadLocalFile(fileKey)}
            className={cx('retry-button')}
        >重试
        </span>
    );
};
export default RetryButton;
