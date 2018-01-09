<template>
  <div class="content">
    <div class="title">
      <button class="back" @click="handleBack">
        <i class="material-icons">keyboard_arrow_left</i>
      </button>
      <p>
        Tag List
      </p>
    </div>
    <div class="container-wrapper">
      <div class="tags-container">
        <button 
          v-for="tag of tags" 
          :key="tag" 
          @click="() => handleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleBack (){
      this.$store.dispatch('closeTagList')
    },

    handleTag (tag){
      this.$store.dispatch('closeTagList')
      this.$store.dispatch('search', { text: tag })
    }
  },

  computed: {
    tags (){
      return this.$store.state.tagList.tags.sort()
    }
  }
}
</script>

<style lang="sass" scoped>
@import 'common.sass'

.content
  height: 100%

.title
  display: grid
  grid-template-columns: 40px auto
  grid-template-rows: 40px

  & p
    padding-left: 10px
    line-height: 40px
    font-size: 16px

.back
  @extend %btn

.container-wrapper
  height: calc(100% - 40px)
  padding-right: 10px
  overflow-y: auto

.tags-container
  padding: 10px 20px

  & button
    @extend %btn
    width: initial
    padding: 4px 8px
    box-shadow: 0 3px 8px 1px #aaaaaa
    margin: 10px 10px
</style>
