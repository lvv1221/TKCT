import axios from 'axios'
import config from '@/assets/config/env-conf'
// import config from '@/assets/config/test-conf'
// import config from '@/assets/config/pro-conf'

export const selectServer = {
  getSubjects (params) {
    return axios.get(config.baseUrl, {
      params: {
        method: 'ersp.resource.metadata.category.list',
        appkey: 'zyjxtpc',
        access_token: params.token,
        format: 'json',
        key: 'subject',
        version: '1.0'
      }
    })
  },
  getPublishers (params) {
    return axios.get(config.baseUrl, {
      params: {
        method: 'ersp.resource.metadata.category.list',
        appkey: 'zyjxtpc',
        access_token: params.token,
        format: 'json',
        key: 'publisher',
        version: '1.0',
        subject: params.subject
      }
    })
  },
  getGrades (params) {
    return axios.get(config.baseUrl, {
      params: {
        method: 'ersp.resource.metadata.category.list',
        appkey: 'zyjxtpc',
        access_token: params.token,
        format: 'json',
        key: 'grade',
        subject: params.subject,
        publisher: params.publisher,
        version: '1.0'
      }
    })
  },
  getBooks (params) {
    return axios.get(config.baseUrl, {
      params: {
        method: 'ersp.resource.metadata.book.list',
        appkey: 'zyjxtpc',
        access_token: params.token,
        format: 'json',
        key: 'publisher',
        subject: params.subject,
        publisher: params.publisher,
        grade: params.grade,
        version: '1.0'
      }
    })
  }
}
