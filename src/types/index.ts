type Method = 'get' | 'post' | 'put' | 'delete' | 'option'

export interface AxiosRequestConfig {
  url: string
  method?: Method
  params?: any
  data?: any
}
