import axios from 'axios'
import config from '@/assets/config/env-conf'

export const mainServer = {
  getToken () {
    return axios.get(config.tkUrl, {
      params: {
        client_id: 'zyjxtpc',
        client_secret: 'a50c4eb060408042',
        grant_type: 'client_credentials'
      }
    })
  }
}
