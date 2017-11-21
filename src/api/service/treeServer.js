import axios from 'axios'
import config from '@/assets/config/env-conf'
// import config from '@/assets/config/pro-conf'

export const treeServer = {
  getTree (params) {
    return axios.get(config.baseUrl, {
      params: {
        method: 'ersp.resource.metadata.book.unit.list',
        appkey: 'zyjxtpc',
        access_token: params.token,
        format: 'json',
        version: '1.0',
        bookCode: params.bookCode
      }
    })
  }
}
