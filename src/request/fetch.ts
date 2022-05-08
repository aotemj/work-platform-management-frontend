import service from './service'
import { REQUEST_METHODS, REQUEST_TYPE } from '../constant'
import { AxiosRequestHeadersExtend, RequestParams, RequestResults } from './types'

export const fetch = async ({
  url,
  params,
  method,
  type
}: RequestParams): Promise<RequestResults> => {
  const { POST, GET, PUT } = REQUEST_METHODS
  const { FORM_DATA, BLOB, JSON: JSON_TYPE } = REQUEST_TYPE

  const headers: AxiosRequestHeadersExtend = {
    'Access-Control-Allow-Origin': '*'
  }
  if (method === POST || method === PUT) {
    if (type === FORM_DATA) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
      headers['Content-Type'] = 'application/json'
    }
  }

  return await service({
    method,
    headers,
    url,
    data: method === POST || method === PUT ? params : '',
    responseType: type === BLOB ? BLOB : JSON_TYPE,
    transformRequest: [
      function (data) {
        if (method === POST || method === PUT) {
          if (type === FORM_DATA) {
            return data
          }
          return JSON.stringify(data)
        }
        let ret = ''
        // eslint-disable-next-line
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }
    ],
    params: method === GET ? params : ''
  })
}

export const request = async ({
  url,
  params,
  method = REQUEST_METHODS.GET,
  type
}: RequestParams): Promise<RequestResults> => {
  return await new Promise((resolve, reject) => {
    fetch({ url, params, method, type }).then(res => {
      resolve(res)
    }).catch(e => {
      reject(e)
    })
  })
}
