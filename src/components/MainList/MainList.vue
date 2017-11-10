<template>
<div>mainlist</div>
</template>

<script>
  import {listServer} from '@/api'
  export default {
    name: 'MainList',
    props: ['catalog'],
    data () {
      return {
        token: ''
      }
    },
    created () {
      listServer.getToken2().then(result => {
        this.token = result.access_token
      })
    },
    methods: {
      getHomeWork () {
        let params = {
          token: this.token,
          catalog: this.catalog,
          page: 1
        }
        listServer.getHomeWork(params).then(result => {
          console.log(result.count)
        })
      }
    }
  }
</script>

<style>

</style>
