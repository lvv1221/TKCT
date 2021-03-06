import axios from 'axios'

// 引入其他services
export * from './service/selectServer'
export * from './service/mainServer'
export * from './service/treeServer'
export * from './service/listServer'

// 以下为axios全局设置
// axios.defaults.withCredentials = true
axios.defaults.timeout = 1000 * 15
// 配置axios 拦截器
// 添加请求拦截器
axios.interceptors.request.use((config) => {
  // 在发送请求之前做某事
  return config
}, (error) => {
  // 请求错误时做些事
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use((response) => {
  // 对响应数据做些事
  const result = response.data
  // console.log(JSON.stringify(result.data.message))
  if (!result) {
    return Promise.reject(new Error(0, '数据异常！'))
  }
  if (result.data) {
    // 成功
    return result.data
  }
  if (!result.data && result) {
    return result
  }
  return Promise.reject(new Error(-2, '服务异常！'))
}, (error) => {
  // 请求错误时提示
  return Promise.reject(error)
})
