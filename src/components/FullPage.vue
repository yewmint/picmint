<template>
  <div 
    ref="fullPage" 
    class="full-page"
  >
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

function fadeIn(el) {
  tween({
    from: { y: -40, opacity: 0 },
    to: { y: 0, opacity: 1 },
    ease: easing.circOut,
    duration: 300
  }).start(styler(el).set)
}

/**
 * show full page content
 * perform transition when entering
 */
export default {
  props: {
    page: { type: String, default: '' }
  },

  computed: {
    content() {
      return PAGES[this.page]
    }
  },

  watch: {
    page() {
      fadeIn(this.$refs.fullPage)
    }
  },

  mounted() {
    fadeIn(this.$refs.fullPage)
  }
}
</script>

<style lang="scss" scoped>
.full-page {
  width: 100vw;
  height: 100vh;
}
</style>
