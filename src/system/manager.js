const manager = {
  systems: [],

  register (system){
    this.systems.push(system)
  },

  enter (){
    this.systems.forEach(system => system.enter())
  },

  leave (){
    this.systems.forEach(system => system.leave())
  }
}

export default manager