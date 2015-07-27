import connect from './connect'
import User from './user'

export default function join(name){
  connect.then(socket => {
    const user = User.get()

    socket.on(`room:join`, onJoin)
    socket.emit('room:join', name)

    function onJoin(_name, _user){
      socket.off(`room:join`, onJoin)
      if (name !== _name) throw new Error('?')
      if (user.id !== _user.id) throw new Error('?')
    }
  }).catch(err => { throw err })
}