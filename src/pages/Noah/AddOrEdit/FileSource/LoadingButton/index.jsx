import cx from './index.less';
import {LOADING_STATUS} from '../../constants';

const Checking = () => {
    return <span className={cx('checking')}>即将上传 </span>;
};
const Uploading = () => {
    return <span className={cx('uploading')}>上传中 </span>;
};

// 即将完成
const NearingCompletion = () => {
    return <span className={cx('uploading')}>即将完成 </span>;
};

const LoadingButton = props => {
    const {uploadStatusByFrontEnd} = props;
    const {STARTING, SUCCESS, UPLOADING, CHECKING} = LOADING_STATUS;
    switch (uploadStatusByFrontEnd) {
        case STARTING:
        case CHECKING:
            return <Checking />;
        case UPLOADING:
            return <Uploading />;
        case SUCCESS:
            return <NearingCompletion />;
    }
};
export default LoadingButton;
