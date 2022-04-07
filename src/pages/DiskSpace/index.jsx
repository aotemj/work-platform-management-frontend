import {useNavigate} from 'react-router-dom';
import {PageHeader} from '@osui/ui';

import cx from '../Cron/List/index.less';

const DiskSpace = () => {
    const title = '磁盘空间管理';
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };
    return (
        <div className={cx('disk-space')}>
            <PageHeader title={title} className={cx('title')} onBack={goBack} />
        </div>
    );
};

export default DiskSpace;
