export const PROJECT_ROUTE = '_settings';

export const ROUTE_PREFIX = `/:companyId/${PROJECT_ROUTE}`;

// common pagination
export const DEFAULT_PAGINATION = {
    list: [],
    pageSize: 10,
    pageNum: 1,
    total: 0,
    pageSizeOptions: [10, 20, 30, 50],
};

export const CONTAINER_DOM_ID = 'osc-noah';

export const REQUEST_METHODS =  {
    GET: 'GET',
    POST: 'post',
    PUT: 'put',
};
