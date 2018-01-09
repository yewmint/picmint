<template>
  <div class="content">
    <div class="tag-aside">
      <div class="tag-title">
        <button class="back" @click="handleBack">
          <i class="material-icons">keyboard_arrow_left</i>
        </button>
        <p>
          Tags
        </p>
      </div>
      <div class="tag-section">
        <form class="tag-new" @submit="handleAdd">
          <input v-model="newTag" placeholder="New tag"/>
          <button type="submit" class="add">
            <i class="material-icons">add</i>
          </button>
        </form>
        <transition-group class="tag-list" name="tag-list" tag="div">
          <div 
            class="tag" 
            v-for="tag of picture.tags.split(/\s+/).reverse()"
            :key="tag"
          >
            <p>{{ tag }}</p>
            <button 
              class="tag-remove" 
              @click="() => handleRemove(tag)"
            >
              <i class="material-icons">clear</i>
            </button>
          </div>
        </transition-group>
      </div>
      <div class="list-mask"></div>
    </div>
    <div 
      class="picture" 
      :style="`background-image: url('${picture.url}')`" 
      @click="handleOpenPicture"
    >
    </div>
  </div>
</template>

<script>
export default {
  data (){
    return {
      newTag: ''
    }
  },

  computed: {
    picture (){
      return this.$store.getters.detailPicture
    }
  },

  methods: {
    handleBack (){
      this.$store.dispatch('toggleDetail')
    },

    handleAdd (ev){
      ev.preventDefault()

      // prevent empty tag
      if (this.newTag.length === 0){
        return
      }

      this.$store.dispatch('addTag', {
        tag: this.newTag, 
        hash: this.picture.hash 
      })

      // reset
      this.newTag = ''
    },

    handleRemove (tag){
      this.$store.dispatch('removeTag', {
        tag: tag, 
        hash: this.picture.hash 
      })
    },

    handleOpenPicture (){
      this.$store.dispatch('openPicture', {
        path: this.picture.path 
      })
    }
  }
}
</script>

<style lang="sass" scoped>
@import 'common.sass'

.content
  display: grid
  width: 100%
  height: 100%
  grid-template-columns: 240px auto
  grid-template-rows: 100%

.tag-aside
  z-index: 101
  box-shadow: 0px 0px 17px 4px rgba(0, 0, 0, 0.4)
  
.picture
  cursor: pointer
  background-color: #ababab
  background-size: cover
  background-position: center

.tag-title
  display: grid
  grid-template-columns: 40px auto
  grid-template-rows: 40px

  & p
    padding-left: 10px
    line-height: 40px
    font-size: 16px

.back
  @extend %btn

.tag-new
  display: grid
  grid-template-columns: auto 32px
  grid-template-rows: 32px

  & input
    width: 100%
    padding: 8px
    border: none

    &:focus
      outline: none

  & button
    @extend %btn
    width: 32px
    height: 32px
    transition: box-shadow 200ms
    background: linear-gradient(45deg, #9369fe, #f05cff)

    & i
      color: #fff

.tag-section
  padding: 12px
  height: calc(100% - 40px)
  overflow-y: auto

.tag, .tag-new
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.28)
  margin-bottom: 16px

.tag

  display: grid
  grid-template-columns: auto 32px
  grid-template-rows: 32px
  overflow: hidden

  & p
    padding: 4px 8px
    line-height: 24px

  & button
    @extend %btn
    width: 32px
    height: 32px

.tag-list
  position: relative

.tag
  transition: all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)

.tag-list-enter
  transition: all 0.3s cubic-bezier(0.0, 0.0, 0.2, 1)

.tag-list-leave-to
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)

.tag-list-enter, .tag-list-leave-to
  opacity: 0
  transform: translateX(-10px)

.tag-list-leave-active
  position: absolute
  width: 100%

</style>
