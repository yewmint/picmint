<template>
  <div :class="className">
    <div class="title-text">
      {{ title }}
    </div>
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
import config from '../../app.config.json'

export default {
  components: { TitleButton },

  props: {
    theme: { type: String, default: 'light' }
  },
  
  data: () => ({ 
    title: config.WINDOW_TITLE 
  }),

  methods: {
    minimize: () => console.log('minimize'),
    maxmize: () => console.log('maxmize'),
    close: () => console.log('close'),
  },

  computed: {
    className: () => classname('title', this.theme)
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
