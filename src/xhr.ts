import { AxiosRequestConfig } from './types/index'

export default function xhr(config: AxiosRequestConfig) {
  const { method = 'get', url, data, params } = config

  const request = new XMLHttpRequest()

  request.open(method.toUpperCase(), url)

  request.send(data)
}
