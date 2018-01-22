<template>
  <transition name="fade">
    <div 
      v-if="show" 
      class="picmint-modal"
    >
      <div :class="`content-wrapper ${fullSize && 'fullsize'}`">
        <component :is="content" />
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * show content of modal
 * and perform transition for enterin and leaving
 */
export default {
  props: {
    show: { type: Boolean, default: false },
    fullSize: { type: Boolean, default: true },
    content: { type: Object, default: () => ({}) }
  }
}
</script>

<style lang="scss" scoped>
@import 'common.sass';

.picmint-modal {
  @extend %center-child;

  z-index: 100;
  top: 0;
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  padding-top: 40px;
}

.content-wrapper {
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 80px);
  background-color: white;
  box-shadow: 0 0 17px 4px rgba(0, 0, 0, 0.4);
  overflow: hidden;

  &.fullsize {
    width: calc(100vw - 40px);
    height: calc(100vh - 80px);
  }
}

.fade-enter,
.fade-leave-to {
  opacity: 0;

  & .content-wrapper {
    transform: translateY(-40px);
  }
}

.fade-enter-active {
  transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);

  & .content-wrapper {
    transition: all 0.2s cubic-bezier(0, 0, 0.2, 1);
  }
}

.fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);

  & .content-wrapper {
    transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
  }
}
</style>
