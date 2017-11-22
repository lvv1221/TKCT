<template>
  <div class="btn-group exam_group" :class="{'open': selectShow && type === selectName}">
    <a class="btn dropdown-toggle exam_toggle"  href="#"  @click="open">
      <span class="exam_textbook"  title="name" >{{name}}</span>
      <span class="caret exam_caret"></span>
    </a>
    <!--下拉列表（通过UI给的样式控制）-->
    <ul class="dropdown-menu exam_menu exam_scroll">
      <li><a href="#" v-for="item in items" :title="item.name" @click="selectItem(item)">{{item.name}}</a></li>
    </ul>
    </div>
</template>

<script>
  export default {
    name: 'ExSelect',
    props: ['items', 'selectName'],
    data () {
      return {
        name: '',
        selectShow: false
      }
    },
    watch: {
      // 如果选择课本后重新选择课本，则触发重置事件（只有第四个选择框被监听）
      items (items, oldItems) {
        this.name = ''
        if (oldItems.length !== 0 && items.length === 0) {
          this.$emit('reset')
        }
      }
    },
    computed: {
      // 选择框类型（为了控制点击另一个选择框后，前一个选择框下拉列表关闭）
      type () {
        return this.$store.state.selectType
      }
    },
    methods: {
      // 选择点击后
      selectItem (item) {
        this.name = item.name
        this.$emit('select', item)
        this.selectShow = false
      },
      // 打开下拉列表
      open () {
        this.$store.dispatch('setSelectType', this.selectName)
        this.selectShow = !this.selectShow
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .btn
    padding 3px 5px
    border 1px solid #7F7F7F
    border-radius 0
  .dropdown-menu
    min-width initial
    border-radius 0
    li
      a
        padding 0 5px
</style>
