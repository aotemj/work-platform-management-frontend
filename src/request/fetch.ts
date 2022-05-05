import service from './service'
import { REQUEST_METHODS, REQUEST_TYPE } from '../constant'

export const fetch = async (url, params, method, type) => {
  const { POST, GET, PUT } = REQUEST_METHODS
  const { FORM_DATA, BLOB, JSON: JSON_TYPE } = REQUEST_TYPE

  const headers = {
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
    method: method,
    headers,
    url,
    data: method === POST || method === PUT ? params : '',
    response: type === BLOB ? BLOB : JSON_TYPE,
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

export const request = async ({ url, params, method = REQUEST_METHODS.GET, type }) => {
  return await new Promise((resolve, reject) => {
    fetch(url, params, method, type).then(res => {
      resolve(res)
    })
  })
}
