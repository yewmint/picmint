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
        Tag List
      </p>
    </div>
    <div class="container-wrapper">
      <div class="tags-container">
        <button 
          v-for="tag of tags" 
          :key="tag" 
          @click="() => handleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * tag list in detail page
 * add ande remove tag of current picture
 */
export default {
  computed: {
    tags() {
      return this.$store.state.tags.slice(0).sort()
    }
  },

  methods: {
    handleBack() {
      this.$store.dispatch('toggleTagList')
    },

    handleTag(tag) {
      this.$store.dispatch('toggleTagList')
      this.$store.dispatch('search', { text: tag })
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common.sass';

.content {
  height: 100%;
}

.title {
  display: grid;
  grid-template-columns: 40px auto;
  grid-template-rows: 40px;

  & p {
    padding-left: 10px;
    line-height: 40px;
    font-size: 16px;
  }
}

.back {
  @extend %btn;
}

.container-wrapper {
  height: calc(100% - 40px);
  padding-right: 10px;
  overflow-y: auto;
}

.tags-container {
  text-align: center;
  padding: 10px 20px;

  & button {
    @extend %btn;

    background-color: #00a3af;
    color: white;
    width: initial;
    padding: 4px 8px;
    box-shadow: 0 1px 2px 1px #aaa;
    margin: 10px 10px;

    &:hover {
      background-color: #148992;
      transform: translateY(-5px);
    }
  }
}
</style>
