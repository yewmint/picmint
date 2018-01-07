<template>
  <div class="main">
    <form class="search-bar" @submit="handleSubmit">
      <div class="search-frame">
        <input 
          ref="search"
          placeholder="Time to search :)"
        />
        <button type="submit">
          <i class="material-icons">play_arrow</i>
        </button>
      </div>
    </form>
    <div class="result-list">
      I'm a list, wow
    </div>
  </div>
</template>

<script>
export default {
  mounted (){
    this.$refs.search.focus()
  },

  methods: {
    handleSubmit (ev){
      ev.preventDefault()
      console.log('search !')
    }
  }
}
</script>

<style lang="sass" scoped>
@import 'common.sass'

$search-bar-height: 100px
$frame-height: 40px

.search-bar
  @extend %center-child
  height: $search-bar-height
  background: linear-gradient(45deg, #5f3aa0, #c75bbf)
  padding-top: 20px
  box-shadow: 0px 2px 20px 0px #636363

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
    @extend %btn, %center-child
    width: $frame-height
    height: $frame-height
    background-color: #ffffff

    & i
      color: #4c4c4c

    &:hover
      background-color: #9a9a9a

.picture-list
  height: calc(100vh - #{$search-bar-height})
  overflow-y: auto
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))
  grid-template-rows: repeat(auto-fit, 200px)
</style>
