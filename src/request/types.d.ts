import {REQUEST_TYPE} from '../constant'
import {Method} from 'axios'

export interface AxiosRequestHeadersExtend extends AxiosRequestHeaders {
  [props: string]: string | number | boolean
}

export interface AxiosRequestConfigExtend extends AxiosRequestConfig {
  headers?: AxiosRequestHeadersExtend
}

export type RequestParams = {
  url: string
  params?: object
  method?: Method
  type?: REQUEST_TYPE
}

export type RequestResults = {
  code?: number
  data: {
    [props: string]: any
  }
  status: number
  msg?: string
}
