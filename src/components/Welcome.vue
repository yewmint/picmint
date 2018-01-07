<template>
  <div class="welcome">
    <div class="wrapper">
      <h2>Choose a store to enjoy 🎵</h2>
      <button class="open-store" @click="handleOpen">
        <i class="material-icons">add</i>
      </button>
    </div>
  </div>
</template>

<script>
import { remote } from 'electron'
import _ from 'lodash'

export default {
  methods: {
    handleOpen (){
      let paths = remote.dialog.showOpenDialog({
        title: 'Choose album directory',
        properties: [
          'openDirectory'
        ]
      })

      if (!_.isArray(paths)){
        return 
      }

      let path = paths[0]
      
      this.$store.dispatch('loadStore', { path })
    }
  }
}
</script>

<style lang="sass" scoped>
@import 'common.sass'

.welcome
  @extend %center-child
  width: 100%
  height: 100%

.wrapper
  @extend %center-child

  h2
    margin-bottom: 40px

.open-store
  @extend %btn, %center-child
  border-radius: 4px
  width: 160px
  height: 60px
  background: linear-gradient(45deg, #9369fe, #f05cff)
  box-shadow: none

  & i
    color: #ffffff
    font-size: 36px

  &:hover
    box-shadow: 0 5px 20px 1px #5d5d5d

</style>


