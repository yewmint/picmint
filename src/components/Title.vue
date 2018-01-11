<template>
  <div :class="className">
    <p class="title-text">
      {{ title }}
    </p>
    <div class="title-drag"></div>
    <div class="title-btn-container">
      <TitleButton :theme="theme" :callback="minimize" iconName="remove" />
      <TitleButton :theme="theme" :callback="maxmize" iconName="crop_square" />
      <TitleButton :theme="theme" :callback="close" iconName="clear" />
    </div>
  </div>
</template>

<script>
import TitleButton from './TitleButton'
import classname from 'classname'
import { remote } from 'electron'
import config from '../../app.config.json'

const win = remote.getCurrentWindow()

/**
 * title component on the top most layer
 * simulate windows title
 */
export default {
  components: { TitleButton },
  
  data: () => ({ 
    title: config.WINDOW_TITLE 
  }),

  methods: {
    minimize () {
      win.minimize()
    },

    maxmize () {
      if (win.isMaximized()){
        win.unmaximize()
      }
      else {
        win.maximize()
      }
    },

    close () {
      win.close()
    }
  },

  computed: {
    theme (){
      return this.$store.state.titleTheme
    },
    
    className (){
      return classname('title', this.theme)
    }
      
  }
}
</script>

<style lang="sass" scoped>
@import 'common.sass'

.title
  display: grid
  position: fixed
  top: 0
  width: 100vw
  height: 40px
  background-color: transparent
  grid-template-columns: 120px auto 120px
  grid-template-rows: 100%
  -webkit-app-region: drag
  transition: color 200ms
  z-index: 1000

  &.light
    & i, & p
      color: $text-black

  &.dark
    & i, & p
      color: $text-white

.title-btn-container
  display: grid
  grid-template-columns: repeat(4, 40px)
  grid-template-rows: 100%

.title-text
  line-height: 40px
  font-size: 20px
  font-weight: 500
  padding-left: 10px
  transition: color 200ms

</style>
