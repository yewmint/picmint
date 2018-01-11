<template>
  <div class="loading">
    <div class="wrapper">
      <h2>Loading store, take a sip of coffee ☕</h2>
      <div class="loading-icon">
        <i ref="loadingIcon" class="material-icons">
          donut_large
        </i>
      </div>
    </div>
  </div>
</template>

<script>
import { tween, styler, easing } from 'popmotion'

function rotate (el) {
  tween({ 
    from: 0,
    to: 360, 
    duration: 2000,
    loop: Infinity,
    ease: easing.linear,
  }).start(styler(el).set('rotate'))
}

/**
 * loading page
 */
export default {
  mounted (){
    rotate(this.$refs.loadingIcon)
  }
}
</script>

<style lang="sass" scoped>
@import 'common.sass'

.loading
  @extend %center-child
  width: 100%
  height: 100%

.wrapper
  @extend %center-child

  h2
    margin-bottom: 60px

  i
    font-size: 48px
</style>
