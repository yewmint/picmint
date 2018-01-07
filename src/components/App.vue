<template>
  <Title theme="light" />
</template>

<script>
import Title from './Title'

export default {
  components: { Title }
}
</script>

<style lang="sass">
@import 'common.sass'
body 
  background-color: #fff
  overflow: hidden
  -webkit-user-select: none
  cursor: default
  background-color: transparent
  transition: background-color 100ms
  color: $text-black

*::-webkit-scrollbar
  width: 10px
  height: 10px

 
*::-webkit-scrollbar-thumb
  background: #888
  border-radius: 20px


*::-webkit-scrollbar-track
  background: #ddd
  border-radius: 20px

</style>
