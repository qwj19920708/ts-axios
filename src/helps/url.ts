const encode = (val: string): string => {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/g, ']')
}

//处理Object类型
const processObject = (key: string, obj: Object): Array<[string, string]> => [
  [key, JSON.stringify(obj)]
]

//处理Array类型
const processArray = (key: string, list: Array<any>): Array<[string, string]> =>
  list.map(cur => [`${key}[]`, cur])

//处理Date类型
const processDate = (key: string, date: Date): Array<[string, string]> => [
  [key, date.toISOString()]
]

const processMap = {
  '[object Object]': processObject,
  '[object Array]': processArray,
  '[object Date]': processDate
}

type processMapType = keyof typeof processMap

export const buildUrl = (url: string, params?: any): string => {
  // 去除hash标志
  const hashIndex = url.indexOf('#')
  if (hashIndex > -1) url = url.slice(0, hashIndex)

  // params没有传直接返回原url
  if (!params) return url

  const array: Array<[string, string]> = []

  Object.keys(params).forEach(key => {
    // key对应的值为null和undefined不处理
    if (params[key] === null || params[key] === undefined) return

    const dataType = Object.prototype.toString.call(params[key])
    if (dataType in processMap) {
      // 复杂类型处理逻辑
      array.push(...processMap[dataType as processMapType](key, params[key]))
    } else {
      // 简单类型直接拼接
      array.push([key, params[key]])
    }
  })

  const serializedParams = array.map(item => `${encode(item[0])}=${encode(item[1])}`).join('&')

  return !serializedParams ? url : `${url}?${serializedParams}`
}
