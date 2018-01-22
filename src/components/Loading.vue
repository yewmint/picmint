<template>
  <div class="loading">
    <div class="wrapper">
      <h2>Loading store, take a sip of coffee ☕</h2>
      <div class="progress-bar">
        <div 
          class="progress-indicator"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script>
// import { tween, styler, easing } from 'popmotion'

// function rotate (el) {
//   tween({
//     from: 0,
//     to: 360,
//     duration: 2000,
//     loop: Infinity,
//     ease: easing.linear,
//   }).start(styler(el).set('rotate'))
// }

/**
 * loading page
 */
export default {
  computed: {
    progress() {
      return Math.round(this.$store.state.loadingProgress * 100)
    }
  },

  mounted() {
    // rotate(this.$refs.loadingIcon)
  }
}
</script>

<style lang="scss" scoped>
@import 'common.sass';

.loading {
  @extend %center-child;

  width: 100%;
  height: 100%;
}

.wrapper {
  @extend %center-child;

  h2 {
    margin-bottom: 60px;
  }

  i {
    font-size: 48px;
  }
}

.progress-bar {
  position: relative;
  margin: 20px 0;
  width: 80%;
  height: 4px;
  background-color: #d6d6d6;
}

.progress-indicator {
  position: absolute;
  height: 4px;
  background-color: #8d0cde;
  left: 0;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
