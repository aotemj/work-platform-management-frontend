import {Table, Pagination} from '@osui/ui';
import cx from './index.less';

const PageTable = ({
    columns = [],
    data = [],
    rowKey,
    pageIndex = 1,
    count = 0,
    pageSize = 10,
    onChange,
    className,
    rowSelection = null,
    scroll,
}) => (
    <>
        <Table
            columns={columns}
            dataSource={data}
            rowKey={rowKey}
            className={className}
            pagination={false}
            rowSelection={rowSelection}
            scroll={scroll}
        />
        {
            data.length !== 0 && (
                <div className={cx('table-pagination')}>
                    <span>{count}项，共{Math.ceil(count / pageSize)}页</span>
                    <Pagination
                        showQuickJumper
                        current={pageIndex}
                        pageSize={pageSize}
                        total={count}
                        showSizeChanger
                        onChange={onChange}
                    />
                </div>
            )
        }
    </>
);

export default PageTable;
