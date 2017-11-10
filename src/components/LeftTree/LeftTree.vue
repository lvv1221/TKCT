<template>
<div class="left-tree">
  <p @click="sendCatalog()">{{book.name}}</p>
  <ul>
    <li v-for="unit in courses" ><span @click="sendCatalog([unit.code])">{{unit.name}}</span>
      <template v-if="unit.courses">
      <ul>
        <li v-for="text in unit.courses"><span @click.stop="sendCatalog([unit.code, text.code])">{{text.name}}</span>
          <template v-if="text.courses">
            <ul>
              <li v-for="chapter in text.courses"><span @click.stop="sendCatalog([unit.code, text.code, chapter.code])">{{chapter.name}}</span></li>
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
       // console.log(this.book.code)
        treeServer.getTree(params).then(result => {
         // console.log(result)
          this.courses = result.data
        })
      },
      sendCatalog (codes) {
        let catalog = this.book.code
        if (codes) {
          let temp = ''
          codes.map(code => {
            let arr = code.split('-')
           // console.log(arr[arr.length - 1] + '...')
            temp += '_' + arr[arr.length - 1]
          })
         // console.log(temp + 'temp')
          catalog += temp
        }
        console.log(catalog)
        this.$emit('getCata', catalog)
      }
    }
  }
</script>

<style>

</style>
