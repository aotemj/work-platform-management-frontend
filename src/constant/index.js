export const PROJECT_ROUTE = '_settings';

export const ROUTE_PREFIX = `/:companyId/${PROJECT_ROUTE}`;

// common pagination
export const defaultData = {
    list: [],
    pageSize: 10,
    pageNum: 1,
    total: 0,
    pageSizeOptions: [10, 20, 30, 50],
};
