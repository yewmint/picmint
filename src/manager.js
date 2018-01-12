/**
 * manage life cycle of systems
 */

import _ from 'lodash'

let systems = []

export function register (system = {}){
  systems.push(system)
}

export function enter (){
  systems.forEach(system => {
    if (_.isFunction(system.enter)) {
      system.enter()
    }
  })
}

export function exit (){
  systems.forEach(system => {
    if (_.isFunction(system.exit)) {
      system.exit()
    }
  })

  // clean refs
  systems = []
}