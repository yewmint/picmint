<template>
  <div class="content">
    <div class="title">
      <button 
        class="back" 
        @click="handleBack"
      >
        <i class="material-icons">keyboard_arrow_left</i>
      </button>
      <p>
        Batch
      </p>
    </div>
    <form 
      class="form-wrapper" 
      @submit="handleExecute"
    >
      <div class="line-wrapper">
        <p>Contain:</p>
        <input 
          :readonly="isExecuting" 
          type="text" 
          v-model="contains" 
        >
      </div>
      <div class="line-wrapper">
        <p>Add:</p>
        <input 
          :readonly="isExecuting" 
          type="text" 
          v-model="adds" 
        >
      </div>
      <div class="line-wrapper">
        <p>Remove:</p>
        <input 
          :readonly="isExecuting" 
          type="text" 
          v-model="removes" 
        >
      </div>
      <div class="execute-wrapper">
        <button 
          :disabled="isExecuting" 
          type="submit"
        >
          {{ isExecuting ? 'Executing' : 'Execute' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
/**
 * modal for batch task
 */
export default {
  data() {
    return {
      contains: '',
      adds: '',
      removes: ''
    }
  },

  computed: {
    isExecuting() {
      return this.$store.state.batch.executing
    }
  },

  methods: {
    handleBack() {
      if (!this.isExecuting) {
        this.$store.dispatch('toggleBatch')
      }
    },

    handleExecute(ev) {
      ev.preventDefault()

      if (!this.isExecuting) {
        this.$store.dispatch('runBatch', {
          contains: this.contains,
          adds: this.adds,
          removes: this.removes
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import 'common.sass'

.content
  height: 100%

.title
  display: grid
  grid-template-columns: 40px auto
  grid-template-rows: 40px

  & p
    padding-left: 10px
    line-height: 40px
    font-size: 16px

.back
  @extend %btn

.form-wrapper
  padding: 4px 16px

.line-wrapper
  display: grid
  grid-template-columns: 80px 300px
  grid-template-rows: 32px
  margin: 16px 0
  box-shadow: 0 1px 4px 1px #aaaaaa

  & p
    line-height: 32px
    padding: 0 8px

  & input
    border: none
    margin: 0
    padding: 4px 8px
    line-height: 32px

    &:focus
      outline: none

.execute-wrapper
  text-align: right
  margin-bottom: 8px

  & button
    @extend %btn
    color: #ffffff
    background-color: #00a3af
    height: 32px
    width: initial
    padding: 0 8px
    box-shadow: 0 1px 4px 1px #aaaaaa

    &:hover
      background-color: #127c84
</style>
