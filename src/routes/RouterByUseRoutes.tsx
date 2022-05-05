import { useRoutes } from 'react-router-dom'
import urlJoin from 'url-join'

import { routes } from './index'
import { PROJECT_ROUTE, PUBLIC_PATH } from '../constant'

const ROUTE_PREFIX = {
  COMPANY: urlJoin(PUBLIC_PATH, ':companyId', PROJECT_ROUTE), // 企业级
  PROJECT: urlJoin(PUBLIC_PATH, ':companyId', ':projectId', PROJECT_ROUTE) // 项目级
}

const replacePath = (publicPath, item) => {
  const { path } = item
  return {
    ...item,
    path: urlJoin(publicPath, path)
  }
}
const RouterByUseRoutes = () => {
  const values = Object.values(routes)
  const routesWithCompanyId = values
    .map(route => replacePath(ROUTE_PREFIX.COMPANY, route))
  const routesWithProjectId = values
    .map(route => replacePath(ROUTE_PREFIX.PROJECT, route))

  const routeList = [
    ...routesWithCompanyId,
    ...routesWithProjectId
  ]
  return useRoutes(routeList)
}

export default RouterByUseRoutes
