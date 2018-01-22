<template>
  <button 
    :class="className" 
    @click="callback" 
  >
    <i class="material-icons">{{ iconName }}</i>
  </button>
</template>

<script>
import _ from 'lodash'

/**
 * simulate minimize, maximize and close button
 */
export default {
  props: {
    theme: { type: String, default: 'light' },
    callback: { type: Function, default: _.noop },
    iconName: { type: String, default: 'code' }
  },

  computed: {
    className() {
      return `${this.theme}-btn`
    }
  }
}
</script>
