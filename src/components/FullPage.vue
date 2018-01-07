<template>
  <div ref="fullPage" class="full-page">
    <component :is="content" />
  </div>
</template>

<script>
import { tween, styler, easing } from 'popmotion'
import Welcome from './Welcome'
import Loading from './Loading'
import Main from './Main'

const PAGES = {
  welcome: Welcome,
  loading: Loading,
  main: Main
}

function fadeIn (el) {
  tween({ 
    from: { y: -40, opacity: 0 },
    to: { y: 0, opacity: 1 }, 
    ease: easing.circOut,
    duration: 300 
  }).start(styler(el).set)
}

export default {
  props: {
    page: String
  },

  computed: {
    content (){
      return PAGES[this.page]
    }
  },

  mounted (){
    fadeIn(this.$refs.fullPage)
  },

  watch: {
    page (){
      fadeIn(this.$refs.fullPage)
    }
  }
}
</script>

<style lang="sass" scoped>
.full-page
  width: 100vw
  height: 100vh
</style>
