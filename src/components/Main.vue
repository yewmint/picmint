<template>
  <div class="main">
    <div class="title-bar">
      <div class="control-wrapper">
        <div class="batch-wrapper">
          <button @click="handleBatch">
            <i class="material-icons">card_travel</i>
          </button>
        </div>
        <div class="tags-wrapper">
          <button @click="handleTags">
            <i class="material-icons">local_offer</i>
          </button>
        </div>
        <form 
          class="search-frame" 
          @submit="handleSubmit"
        >
          <input 
            ref="search"
            v-model="value"
            placeholder="Time to search :)"
          >
          <button type="submit">
            <i class="material-icons">play_arrow</i>
          </button>
        </form>
      </div>
    </div>
    <div class="result-list">
      <List />
    </div>
  </div>
</template>

<script>
import List from './List'

/**
 * main page for managing pictures
 * mainly for searching
 */
export default {
  components: {
    List
  },

  data() {
    return {
      value: ''
    }
  },

  mounted() {
    this.$refs.search.focus()
  },

  methods: {
    handleSubmit(ev) {
      ev.preventDefault()
      this.$store.dispatch('search', { text: this.value })
    },

    handleTags() {
      this.$store.dispatch('toggleTagList')
    },

    handleBatch() {
      this.$store.dispatch('toggleBatch')
    }
  }
}
</script>

<style lang="sass" scoped>
@import 'common.sass'

%control-btn
  @extend %btn, %center-child
  width: $frame-height
  height: $frame-height
  background-color: #ffffff

  & i
    color: #4c4c4c

  &:hover
    background-color: #9a9a9a

.title-bar
  @extend %center-child
  height: $search-bar-height
  background: linear-gradient(45deg, #5f3aa0, #c75bbf)
  padding-top: 20px
  box-shadow: 0px 2px 20px 0px #636363

.control-wrapper
  display: grid
  grid-template-columns: 40px 40px 540px
  grid-template-rows: 40px
  grid-column-gap: 20px

.tags-wrapper, .batch-wrapper
  box-shadow: 0 5px 20px 1px rgba(0, 0, 0, 0.6)
  & button
    @extend %control-btn

.search-frame
  box-shadow: 0 5px 20px 1px #5b3f69
  height: $frame-height
  display: grid
  grid-template-columns: 500px 40px

  & input
    width: 500px
    padding: 8px
    border: none

    &:focus
      outline: none

  & button
    @extend %control-btn

.picture-list
  height: calc(100vh - #{$search-bar-height})
  overflow-y: auto
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
  grid-template-rows: repeat(auto-fit, 200px)
</style>
