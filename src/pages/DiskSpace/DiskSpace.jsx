import {useNavigate} from 'react-router-dom';
import {PageHeader} from '@osui/ui';
import {useEffect} from 'react';

import cx from './index.less';
import PieCharts from './PieCharts';
import {ReactComponent as InfoIcon} from '../../statics/icons/newInfo.svg';

const title = '磁盘空间管理';

const DiskSpace = props => {
    const {updateDiskSpaceInfo, diskSpaceInfo} = props;
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        updateDiskSpaceInfo();
    }, []);

    return (
        <div className={cx('disk-space')}>
            <PageHeader title={title} className={cx('title')} onBack={goBack} />
            <div className={cx('sub-title')}>
                <InfoIcon className={cx('info-icon')} />
                <div className={cx('right')}>
                    <div className={cx('top')}>
                        说明
                    </div>
                    <div className={cx('bottom')}>
                        文件分发作业，以及定时作业任务需要文件在服务器上存储中转，会占用服务器磁盘资源
                    </div>
                </div>
            </div>
            <div className={cx('chart-container')}>
                <h3>存储空间监控</h3>
                <PieCharts diskSpaceInfo={diskSpaceInfo} />
            </div>
        </div>
    );
};

export default DiskSpace;
