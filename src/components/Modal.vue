<template>
  <transition name="fade">
    <div v-if="show" class="picmint-modal">
      <div class="content-wrapper">
        <component :is="content" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, default: false },
    content: Object
  }
}
</script>

<style lang="sass" scoped>
.picmint-modal
  z-index: 100
  top: 0
  position: fixed
  width: 100vw
  height: 100vh
  background-color: rgba(0, 0, 0, 0.6)
  padding-top: 40px

.fade-enter, .fade-leave-to
  opacity: 0

  & .content-wrapper
    transform: translateY(-40px)

.fade-enter-active
  transition: all .2s cubic-bezier(0.0, 0.0, 0.2, 1)

  & .content-wrapper
    transition: all .2s cubic-bezier(0.0, 0.0, 0.2, 1)
  
.fade-leave-active
  transition: all .2s cubic-bezier(0.4, 0.0, 1, 1)

  & .content-wrapper
    transition: all .2s cubic-bezier(0.4, 0.0, 1, 1)

.content-wrapper
  margin: 20px
  width: calc(100vw - 40px)
  height: calc(100vh - 80px)
  background-color: white
  box-shadow: 0px 0px 17px 4px rgba(0, 0, 0, 0.4)
  overflow: hidden
</style>
