import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'

export default function xhr(config:AxiosRequestConfig): AxiosPromise{

    return new Promise((resolve, reject) => {
        const { data = null, url, method = 'get', headers, 
            responseType, timeout } = config

        const request = new XMLHttpRequest()

        if (responseType) {
            request.responseType = responseType
        }

        if (timeout) {
            request.timeout = timeout
        }

        request.open(method.toUpperCase(), url!, true)

        request.onreadystatechange = () => {
            if (request.readyState !== 4) {
                return
            }

            if (request.status === 0) {
                // console.log(request.status)
            }

            const responseHeaders = request.getAllResponseHeaders()
            const responseData = responseType !== 'text' ? request.response : request.responseText
            const response:AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: parseHeaders(responseHeaders),
                config, request
            }

            handleResponse(response)
        }

        request.onerror = () => {
            reject( createError( 'Network Error', config, null, request ) )
        }

        request.ontimeout = () => {
            reject( createError( 'Timeout of ${timeout} ms exceeded', config, 'ECONNABORTED', request ) )
        }

        Object.keys(headers).forEach(name => {
            if (data === null && name.toLocaleLowerCase() === 'content-type') {
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
                    createError (
                        `Request failed with status code ${response.status}`,
                        config, null, request, response
                    )
                )
            }
        }
    })
    
}