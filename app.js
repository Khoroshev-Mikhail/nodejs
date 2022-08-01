const Emitter = require('events')
let emitter = new Emitter();
let eventName = 'greeet'
emitter.on(eventName, ()=> {
    console.log('hello all')
})
emitter.on(eventName, ()=> {
    console.log('привет')
})
emitter.emit('greeet')