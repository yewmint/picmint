<template>
  <div class="root">
    <Title theme="light" />
    <FullPage :page="page" />
    <Modal :content="Detail" :show="showDetail" />
    <Modal :content="TagList" :show="showTagList" :fullSize="false" />
    <Modal :content="Batch" :show="showBatch" :fullSize="false" />
  </div>
</template>

<script>
import Title from './Title'
import FullPage from './FullPage'
import Modal from './Modal'
import Detail from './Detail'
import TagList from './TagList'
import Batch from './Batch'

export default {
  components: { Title, FullPage, Modal },

  data() {
    return {
      Detail,
      TagList,
      Batch
    }
  },

  computed: {
    page() {
      return this.$store.state.page
    },

    showDetail() {
      return this.$store.state.detail.show
    },

    showTagList() {
      return this.$store.state.tagList.show
    },

    showBatch() {
      return this.$store.state.batch.show
    }
  }
}
</script>

<style lang="sass">
@import 'common.sass'

body
  background-color: #fff
  overflow: hidden
  -webkit-user-select: none
  cursor: default
  background-color: transparent
  transition: background-color 100ms
  color: $text-black

*::-webkit-scrollbar
  width: 10px
  height: 10px
 
*::-webkit-scrollbar-thumb
  background: #888
  border-radius: 20px


*::-webkit-scrollbar-track
  background: #ddd
  border-radius: 20px

</style>
