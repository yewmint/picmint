import { h } from 'hyperapp'
import { rpc } from '../utils'
import { tween, styler, easing } from 'popmotion'
import _ from 'lodash'

// let isShown = false

// function tryFade (show){
//   if (isShown && !show){
//     fadeOut()
//   } 
//   else if (!isShown && show){
//     fadeIn()
//   }
// }

// let detail = null
// let frame = null

// function fadeIn (){
//   if (!detail || !frame) {
//     return
//   }

//   isShown = true

//   tween({ 
//     from: 0,
//     to: 1, 
//     duration: 200,
//     ease: easing.cubicOut,
//   }).start({
//     update: styler(detail).set('opacity'),
//     complete: 
//   })

//   tween({ 
//     from: -20,
//     to: 0, 
//     duration: 200,
//     ease: easing.cubicOut,
//   }).start(styler(frame).set('y'))
// }

// function fadeOut (){
//   if (!detail || !frame) {
//     return
//   }

//   isShown = false

//   tween({ 
//     from: 1,
//     to: 0, 
//     duration: 200,
//     ease: easing.cubicIn,
//   }).start(styler(detail).set('opacity'))

//   tween({ 
//     from: 0,
//     to: -20, 
//     duration: 200,
//     ease: easing.cubicIn,
//   }).start(styler(frame).set('y'))
// }

export default ({ picture }) => {
  return (
    // <div 
    //   class="picture-detail" 
    //   // oncreate={(ele) => {
    //   //   detail = ele
    //   //   tryFade(show)
    //   // }}
    // >
    //   <div class="detail-mask"></div>
    //   <div 
    //     class="detail-frame"
    //     // oncreate={(ele) => {
    //     //   frame = ele
    //     //   tryFade(show)
    //     // }}
    //   >
  
    //   </div>
    // </div>
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
    </div>
  )
}