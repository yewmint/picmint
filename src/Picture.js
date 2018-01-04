const PROPS = [
  'hash',
  'path',
  'tags'
]

export class Picture {
  constructor (data){
    PROPS.forEach(prop => this[prop] = data[prop])
  }

  data (){
    let data = {}
    PROPS.forEach(prop => data[prop] = this[prop])
    return data
  }
}