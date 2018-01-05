import { h } from 'hyperapp'
import { tween, styler, easing } from 'popmotion'

/**
 * fade in element
 */
const fadeIn = (ele) => {
  tween({ 
    from: { y: -40, opacity: 0 },
    to: { y: 0, opacity: 1 }, 
    ease: easing.circOut,
    duration: 300 
  }).start(styler(ele).set)
}

let lastName = null

const update = (ele, name) => {
  if (lastName !== name){
    fadeIn(ele)
    lastName = name
  }
}

export default ({ center, name }, children) => {
  let style = { 
    width: '100vw', 
    height: '100vh' 
  }

  if (center) {
    style = {
      ...style,
      'display': 'grid',
      'justify-items': 'center',
      'align-items': 'center',
    }
  }

  return (
    <div 
      style={style}
      oncreate={ele => fadeIn(ele)}
      onupdate={ele => update(ele, name)}
    >
      {children}
    </div>
  )
}