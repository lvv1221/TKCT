<template>
<div class="left-tree">
  <p @click="sendCatalog()">{{book.name}}</p>
  <ul>
    <li v-for="unit in courses" @click="sendCatalog(unit.code)">{{unit.name}}
      <template v-if="unit.courses">
      <ul>
        <li v-for="text in unit.courses" @click.stop="sendCatalog(text.code)">{{text.name}}
          <template v-if="text.courses">
            <ul>
              <li v-for="chapter in text.courses" @click.stop="sendCatalog(chapter.code)">{{chapter.name}}</li>
            </ul>
          </template>
        </li>
      </ul>
      </template>
    </li>
  </ul>
</div>
</template>

<script>
  import {treeServer} from '@/api'
  export default {
    name: 'LeftTree',
    props: ['token', 'book'],
    data () {
      return {
        courses: []
      }
    },
    watch: {
      token: function () {
       // console.log(this.token)
      },
      book: function () {
        if (this.token) {
          this.getTree()
        }
      }
    },
    methods: {
      getTree () {
        let params = {
          token: this.token,
          bookCode: this.book.code
        }
        console.log(this.book.code)
        treeServer.getTree(params).then(result => {
          console.log(result)
          this.courses = result.data
        })
      },
      sendCatalog (code) {
        let Catalog = this.book.code
        if (code) {
          let arr = code.split('-')
          Catalog = this.book.code + '_' + arr[arr.length - 1]
        }
        console.log(Catalog)
      }
    }
  }
</script>

<style>

</style>
