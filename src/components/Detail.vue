<template>
  <div class="content">
    <div class="tag-aside">
      <div class="tag-title">
        <button 
          class="back" 
          @click="handleBack"
        >
          <i class="material-icons">keyboard_arrow_left</i>
        </button>
        <p>
          Tags
        </p>
      </div>
      <div class="tag-section">
        <form 
          class="tag-new" 
          @submit="handleAdd"
        >
          <input 
            v-model="newTag" 
            placeholder="New tag"
            maxlength="14"
            type="text"
            @keydown="handleInputKeyDown"
          >
          <button 
            type="submit" 
            class="add"
          >
            <i class="material-icons">add</i>
          </button>
          <transition name="hint-list">
            <div 
              v-if="showInpuHint && hints.length > 0" 
              class="hint-list"
            >
              <p 
                v-for="(hint, index) in hints" 
                :key="hint" 
                :class="index === hintIndex && 'selected'"
              >{{ hint }}</p>
            </div>
          </transition>
        </form>
        <transition-group 
          class="tag-list" 
          name="tag-list" 
          tag="div"
        >
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
      <div class="list-mask"/>
    </div>
    <div 
      class="picture" 
      :style="`background-image: url('${picture.url}')`" 
      @click="handleOpenPicture"
    />
  </div>
</template>

<script>
import _ from 'lodash'

const INPUT_KEYS = ['Tab', 'ArrowUp', 'ArrowDown']

/**
 * modal for detail infomations of chosen picture
 */
export default {
  data() {
    return {
      newTag: '',

      hints: [],

      // index of currently chosen hint
      hintIndex: 0
    }
  },

  computed: {
    picture() {
      return this.$store.state.detail.picture
    },

    allTags() {
      return this.$store.state.tags
    },

    showInpuHint() {
      return this.newTag.trim().length > 0
    }
  },

  watch: {
    // detect change of input to rehint
    newTag() {
      let currentInput = _.replace(this.newTag, /\s+/g, '-')

      this.hintIndex = 0
      this.hints = _.filter(this.allTags, tag =>
        _.startsWith(tag, currentInput)
      )
    }
  },

  methods: {
    handleBack() {
      this.$store.dispatch('closeDetail')
    },

    handleAdd(ev) {
      ev.preventDefault()

      // prevent empty tag
      if (this.newTag.length === 0) {
        return
      }

      this.$store.dispatch('addTag', {
        tag: this.newTag,
        hash: this.picture.hash
      })

      // reset
      this.newTag = ''
    },

    handleRemove(tag) {
      this.$store.dispatch('removeTag', {
        tag: tag,
        hash: this.picture.hash
      })
    },

    handleOpenPicture() {
      this.$store.dispatch('openPicture', {
        path: this.picture.path
      })
    },

    // capture up, down and tab key to control hints list
    handleInputKeyDown(ev) {
      if (_.indexOf(INPUT_KEYS, ev.key) !== -1) {
        ev.preventDefault()
        this[`handle${ev.key}`]()
      }
    },

    // tap tab to apply current hint
    handleTab() {
      this.newTag = this.hints[this.hintIndex] + ' '
    },

    // tap up to navigate to previous hint
    handleArrowUp() {
      this.hintIndex = _.max([0, this.hintIndex - 1])
    },

    // tap donw to navigate to next hint
    handleArrowDown() {
      this.hintIndex = _.min([this.hints.length - 1, this.hintIndex + 1])
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common.sass';

.content {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: 240px auto;
  grid-template-rows: 100%;
}

.tag-aside {
  z-index: 101;
  box-shadow: 0 0 17px 4px rgba(0, 0, 0, 0.4);
}

.picture {
  cursor: pointer;
  background-color: #737373;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.tag-title {
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

.tag-new {
  position: relative;
  display: grid;
  grid-template-columns: auto 32px;
  grid-template-rows: 32px;

  & input {
    width: 100%;
    padding: 8px;
    border: none;

    &:focus {
      outline: none;
    }
  }

  & button {
    @extend %btn;
    width: 32px;
    height: 32px;
    transition: box-shadow 200ms;
    background: linear-gradient(45deg, #9369fe, #f05cff);

    & i {
      color: #fff;
    }
  }
}

.hint-list {
  z-index: 200;
  position: absolute;
  top: 32px;
  width: 184px;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.28);

  & p {
    margin: 0;
    padding: 4px 8px;

    &.selected {
      background-color: #cccccc;
    }
  }
}

.hint-list-enter,
.hint-list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.hint-list-enter-active {
  transition: all 0.1s cubic-bezier(0, 0, 0.2, 1);
}

.hint-list-leave-active {
  transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
}

.tag-section {
  padding: 12px;
  height: calc(100% - 40px);
  overflow-y: auto;
}

.tag,
.tag-new {
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.28);
  margin-bottom: 16px;
}

.tag {
  display: grid;
  grid-template-columns: auto 32px;
  grid-template-rows: 32px;
  overflow: hidden;

  & p {
    padding: 4px 8px;
    line-height: 24px;
  }

  & button {
    @extend %btn;
    width: 32px;
    height: 32px;
  }
}

.tag-list {
  position: relative;
}

.tag {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.tag-list-enter {
  transition: all 0.3s cubic-bezier(0, 0, 0.2, 1);
}

.tag-list-leave-to {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tag-list-enter,
.tag-list-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.tag-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
