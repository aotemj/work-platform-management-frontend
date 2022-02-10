const getRouteIds = () => {
    const [, CompanyId, ProjectId] = window.location.pathname.match(/^\/([^/]+)\/([^/]+)\//) || [];
    return [CompanyId, ProjectId];
};

export const getCompanyFix = () => getRouteIds()[0];

export const getSpacefix = () => getRouteIds()[1];

export const getPrefix = () => `/api/cov/${getRouteIds()[0]}/${getRouteIds()[1]}`;
export const getCompanyPrefix = () => `/api/cov/${getRouteIds()[0]}`;
