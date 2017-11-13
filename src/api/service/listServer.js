import axios from 'axios'
import config from '@/assets/config/env-conf'

export const listServer = {
  getToken2 () {
    return axios.get(config.list + '/oauth/token', {
      params: {
        client_secret: 'CULmDjG5dfRlIm5BADwNexdgpAQ7tTtk',
        grant_type: 'client_credentials',
        client_id: 'C6SakiHO'
      }
    })
  },
  getQuestionType (params) {
    return axios.get(config.list + '/api', {
      params: {
        appkey: 'C6SakiHO',
        access_token: params.token,
        method: 'homework.section.list',
        version: '1.0',
        format: 'json',
        subject: '01',
        phase: params.phase
      }
    })
  },
  getHomeWork (params) {
    return axios.get(config.list + '/api', {
      params: {
        appkey: 'C6SakiHO',
        access_token: params.token,
        method: 'homework.question.list',
        version: '2.0',
        format: 'json',
        catalog: params.catalog,
        section: params.section,
        page: params.page,
        limit: config.limit
      }
    })
  }
}
