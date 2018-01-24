<template>
  <div class="list">
    <transition-group
      name="thumbnail-frame"
      tag="div" 
      class="pictures"
      ref="pictures"
    >
      <div 
        class="thumbnail-frame"
        v-for="picture of pictures" 
        :key="picture.hash" 
      >
        <div 
          class="thumbnail" 
          :style="`background-image: url('${picture.thumbUrl}')`"
          @click="() => clickHandler(picture.hash)" 
        />
      </div>
    </transition-group>
    <div 
      class="pagination" 
      v-if="totalPage > 1"
    >
      <button 
        class="left" 
        @click="leftHandler"
      >
        <i class="material-icons">keyboard_arrow_left</i>
      </button>
      <div class="page">
        <button @click="pageListHandler">{{ curPage }}</button>
        <transition name="page-list">
          <div 
            class="page-list" 
            v-if="showPageList"
          >
            <button 
              v-for="idx in totalPage" 
              :key="idx"
              @click="() => selectPageHandler(idx)"
            >
              {{ idx }}  
            </button>
          </div>
        </transition>
      </div>
      <button 
        class="right" 
        @click="rightHandler"
      >
        <i class="material-icons">keyboard_arrow_right</i>
      </button>
    </div>
  </div>
</template>

<script>
import { tween, styler, easing } from 'popmotion'
import _ from 'lodash'

// const NUM_PER_PAGE = 36

function isNode(o) {
  return typeof Node === 'object'
    ? o instanceof Node
    : o &&
        typeof o === 'object' &&
        typeof o.nodeType === 'number' &&
        typeof o.nodeName === 'string'
}

function fadeIn(el) {
  return new Promise(resolve => {
    tween({
      from: { scale: 0.9, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      ease: easing.cubicBezier(0.4, 0.0, 0.2, 1),
      duration: 300
    }).start({
      update: styler(el).set,
      complete: resolve
    })
  })
}

/**
 * list for search result
 */
export default {
  data() {
    return {
      // page: 0
      showPageList: false
    }
  },

  computed: {
    totalPage() {
      return this.$store.state.searchTotalPage
    },

    pictures() {
      return this.$store.state.pictures
    },

    curPage() {
      return this.$store.state.searchPage
    }

    // // pictures in current page
    // pictures (){
    //   return _.chunk(
    //     this.allPictures, NUM_PER_PAGE
    //   )[this.page]
    // }
  },

  watch: {
    // // item may remain unchanged as search occured
    // // invoke fadeList() to force fadein transition
    // allPictures (){
    //   this.page = 0
    //   this.fadeList()
    // }

    // item may remain unchanged as search occured
    // invoke fadeList() to force fadein transition
    pictures() {
      this.fadeList()
    }
  },

  methods: {
    clickHandler(hash) {
      this.$store.dispatch('requestDetail', { hash })
    },

    leftHandler() {
      let tmpPage = this.curPage - 1
      if (_.inRange(tmpPage, 1, this.totalPage + 1)) {
        this.$store.dispatch('searchPage', { page: tmpPage })
      }
    },

    rightHandler() {
      let tmpPage = this.curPage + 1
      if (_.inRange(tmpPage, 1, this.totalPage + 1)) {
        this.$store.dispatch('searchPage', { page: tmpPage })
      }
    },

    pageListHandler() {
      this.showPageList = !this.showPageList
    },

    selectPageHandler(page) {
      if (_.inRange(page, 1, this.totalPage + 1)) {
        this.$store.dispatch('searchPage', { page })
        this.showPageList = !this.showPageList
      }
    },

    fadeList() {
      this.$refs.pictures.$el.childNodes.forEach(child => {
        if (isNode(child)) {
          fadeIn(child)
        }
      })
    },

    async enter(el, done) {
      await fadeIn(el)
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'common.sass';

.list {
  width: 100vw;
  height: calc(100vh - #{$search-bar-height});
  overflow-y: auto;
}

.pictures {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-template-rows: repeat(auto-fit, 200px);
}

.thumbnail-frame {
  @extend %center-child;

  height: 200px;
}

.thumbnail {
  width: 160px;
  height: 160px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 6px 0 #9c9c9c;
  cursor: pointer;
  transition: box-shadow 200ms, transform 200ms;

  &:hover {
    box-shadow: 0 20px 40px 4px #9c9c9c;
    transform: translateY(-10px);
    transition: box-shadow 200ms, transform 200ms;
  }
}

.thumbnail-frame-enter-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.thumbnail-frame-enter {
  opacity: 0;
  transform: scale(0.9);
}

.pagination {
  @extend %center-child;

  width: 140px;
  margin: 20px auto;
  border-radius: 0;
  display: grid;
  grid-template-columns: 40px 60px 40px;
  grid-template-rows: 40px;
  box-shadow: 0 2px 6px 0 rgba(99, 99, 99, 0.74);

  & .left,
  & .right {
    @extend %btn;
  }

  & .page {
    position: relative;
    text-align: center;
  }

  & button {
    @extend %btn;

    width: 60px;
  }

  & .page-list {
    position: absolute;
    bottom: 40px;
    max-height: 6 * 40px;
    overflow-y: auto;
    background-color: #fff;
    box-shadow: 0 2px 10px 1px rgba(99, 99, 99, 0.74);
  }

  & .page-list-enter,
  .page-list-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }

  & .page-list-enter-active,
  .page-list-leave-active {
    transition: all 0.1s;
  }
}
</style>
