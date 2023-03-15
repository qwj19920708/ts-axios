import { parseHeaders } from './helps/headers'
import { createError } from './helps/error'
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types/index'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { method = 'get', url, data, headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url)

    if (responseType) request.responseType = responseType

    if (timeout) request.timeout = timeout

    request.onerror = () => reject(createError('Network Error', config, undefined, request))

    request.ontimeout = () =>
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'TIMEOUT', request))

    request.onreadystatechange = () => {
      if (request.readyState !== 4) return

      const responseHeaders = request.getAllResponseHeaders()
      const responseData = responseType !== 'text' ? request.response : request.responseText

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: parseHeaders(responseHeaders),
        config,
        request
      }

      handleResponse(response)
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            undefined,
            request,
            response
          )
        )
      }
    }
  })
}
