import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios'
import { isEmpty } from 'ramda'
import { message } from '@osui/ui'
import { getCompanyId, getSpaceId } from '../utils/getRouteIds'
import { Toast } from '../utils'

const service = axios.create({
  // timeout: 30000,
})

interface AxiosRequestHeadersExtend extends AxiosRequestHeaders {
  [props: string]: string|number|boolean
}

interface AxiosRequestConfigExtend extends AxiosRequestConfig {
  headers?: AxiosRequestHeadersExtend
}

const companyId = getCompanyId()
const projectId = getSpaceId()

// 判断是企业路由吗？
const groupType = isEmpty(projectId) ? 1 : 2

service.interceptors.request.use(
  (config: AxiosRequestConfigExtend): AxiosRequestConfigExtend => {
    // config.headers['HEADER-USERINFO'] = 'eyJyZWFsbVV1aWQiOiJvc2MiLCJjbGllbnRJZCI6Im9uZS1zc28ifQ==';
    // config.headers['Company-Uuid'] = 'noah-company';
    config.headers = {
      ...config.headers,
      'group-name': isEmpty(projectId) ? projectId : companyId,
      'group-type': groupType
    }

    return config
  },
  async error => {
    return await Promise.reject(error)
  }
)

service.interceptors.response.use(
  async (config: AxiosResponse) => {
    // if (config.config.response === 'blob') {
    //   return await Promise.resolve({
    //     data: response.data
    //   })
    // }
    const { status, statusCode, msg, ...other } = config.data
    const finalMsg = isEmpty(msg) ? message : msg
    if (status === 0 || statusCode === 200 || status === 'OK' || status === undefined) {
      return {
        ...other,
        status: 0,
        msg
      }
    }
    Toast.error(finalMsg)
    return {
      ...other,
      status: -1,
      msg: finalMsg
    }
  },
  async error => {
    const { status, data: { msg = '' } } = error.response
    let finalMessage = ''
    let isEmptyMessage = isEmpty(msg)
    const localtions = window.location
    switch (status) {
      case 400:
        finalMessage = !isEmptyMessage ? msg : '错误的请求，请检查确认'
        break
      case 401:
        window.location.href = `${localtions.origin}/login?redirect=${encodeURIComponent(localtions.href)}`
        break
      case 402:
        window.location.href = `${localtions.origin}/login?user_status=FORBIDDENED}`
        break
      case 403:
        window.location.href = `${localtions.origin}/${getCompanyId()}/${getSpaceId()}/403`
        break
      case 404:
        finalMessage = !isEmpty(msg) ? msg : '资源为空'
        break
      case 500:
        finalMessage = isEmptyMessage ? msg: '服务异常，请刷新重试或联系管理员'
        break
      case 502:
        finalMessage = isEmptyMessage ? msg : '网关异常，请联系管理员'
        break
      case 503:
        finalMessage = isEmptyMessage ? msg : '服务不可用，请联系管理员'
        break
      case 504:
        msg = data.msg || '网关请求超时，请刷新重试或联系管理员'
        break
      default:
        msg = data.msg || '服务器错误'
        break
    }
    if (msg) {
      Toast.error(msg)
    }
    return await Promise.resolve({
      status: -1,
      data: null,
      msg: msg
    })
  }
)

export default service
