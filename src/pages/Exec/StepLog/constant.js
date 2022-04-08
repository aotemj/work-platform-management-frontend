// export const SA_LOG_PREFIX = 'http://dev.gitee.work';
import {IS_PROD} from '../../../constant';

export const SA_LOG_PREFIX = 'https://dev.gitee.work';

export const DEVELOP_SA_LOG_PREFIX = '/sa';

export const transformLogUrl = logUrl => (IS_PROD ? logUrl : logUrl?.replace(SA_LOG_PREFIX, DEVELOP_SA_LOG_PREFIX));
