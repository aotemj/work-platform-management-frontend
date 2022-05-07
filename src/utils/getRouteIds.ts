import { PUBLIC_PATH } from '../constant'

const XLY_PREFIX_REGEXP = /^\/([^/]*)/

export const getCompanyId = (): string => {
  const matches = window.location.pathname.replace(PUBLIC_PATH, '/').match(XLY_PREFIX_REGEXP)
  return (matches != null) ? matches[1] : ''
}

export const getSpaceId = (): string => {
  const pathname: string[] = window.location.pathname
    .replace(PUBLIC_PATH, '/')
    .replace(/^\//, '').split('/')
  if (pathname.length > 1 && !pathname[1].startsWith('_')) {
    return pathname[1]
  } else {
    return ''
  }
}
