const encode = (val: string): string => {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/g, ']')
    .replace(/%26/g, '&')
    .replace(/%3D/g, '=')
}

// 处理Object类型
const processObject = (key: string, obj: Object): Array<string> => [`${key}=${JSON.stringify(obj)}`]

// 处理Array类型
const processArray = (key: string, list: Array<any>): Array<string> =>
  list.map(cur => `${key}[]=${cur}`)

// 处理Date类型
const processDate = (key: string, date: Date): Array<string> => [`${key}=${date.toISOString()}`]

// 处理Date类型
const processSimple = (key: string, value: number | string | boolean): Array<string> => [
  `${key}=${value}`
]

const processMap = {
  '[object Undefined]': () => [],
  '[object Null]': () => [],
  '[object Object]': processObject,
  '[object Array]': processArray,
  '[object Date]': processDate,
  '[object Number]': processSimple,
  '[object String]': processSimple,
  '[object Boolean]': processSimple
}

type processMapType = keyof typeof processMap

export const buildUrl = (url: string, params?: any): string => {
  // 去除hash标志
  const hashIndex = url.indexOf('#')
  if (hashIndex > -1) url = url.slice(0, hashIndex)

  // params没有传直接返回原url
  if (!params) return url
  const array: Array<string> = []
  Object.keys(params).forEach(key => {
    const dataType = Object.prototype.toString.call(params[key])
    array.push(...processMap[dataType as processMapType](key, params[key]))
  })

  // 参数合并到后面
  const serializedParams = array.join('&')
  return !serializedParams ? url : `${url}?${encode(serializedParams)}`
}
